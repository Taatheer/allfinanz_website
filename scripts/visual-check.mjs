import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { inflateSync } from "node:zlib";

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 900 }
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function pngStats(buffer) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let channels = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === "IHDR") {
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      const bitDepth = buffer[dataStart + 8];
      const colorType = buffer[dataStart + 9];
      assert(bitDepth === 8, "Only 8-bit PNG screenshots are supported");
      channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
      assert(channels > 0, `Unsupported PNG color type ${colorType}`);
    }

    if (type === "IDAT") {
      idat.push(buffer.subarray(dataStart, dataEnd));
    }

    if (type === "IEND") break;
    offset = dataEnd + 4;
  }

  const inflated = inflateSync(Buffer.concat(idat));
  const rowLength = width * channels;
  const previous = Buffer.alloc(rowLength);
  const current = Buffer.alloc(rowLength);
  let sourceOffset = 0;
  let visiblePixels = 0;
  let checksum = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;

    for (let x = 0; x < rowLength; x += 1) {
      const raw = inflated[sourceOffset + x];
      const left = x >= channels ? current[x - channels] : 0;
      const up = previous[x];
      const upLeft = x >= channels ? previous[x - channels] : 0;
      let value = raw;

      if (filter === 1) value = raw + left;
      if (filter === 2) value = raw + up;
      if (filter === 3) value = raw + Math.floor((left + up) / 2);
      if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
      }

      current[x] = value & 255;
    }

    for (let x = 0; x < width; x += 1) {
      const index = x * channels;
      const alpha = channels === 4 ? current[index + 3] : 255;
      const luminance = current[index] + current[index + 1] + current[index + 2];
      if (alpha > 8 && luminance > 20) {
        visiblePixels += 1;
        checksum = (checksum + luminance * (x + 1) * (y + 1)) % 1000000007;
      }
    }

    current.copy(previous);
    sourceOffset += rowLength;
  }

  return { width, height, visiblePixels, checksum };
}

async function canvasInfo(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("#three-canvas");
    if (!canvas) {
      throw new Error("3D canvas was not found");
    }

    return {
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight,
      width: canvas.width,
      height: canvas.height
    };
  });
}

const browser = await chromium.launch();
const results = [];
mkdirSync("test-results", { recursive: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("#three-canvas", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const info = await canvasInfo(page);
    const firstCanvasShot = await page.locator("#three-canvas").screenshot({
      path: `test-results/canvas-${viewport.name}-1.png`,
      omitBackground: true
    });
    await page.waitForTimeout(1600);
    const secondCanvasShot = await page.locator("#three-canvas").screenshot({
      path: `test-results/canvas-${viewport.name}-2.png`,
      omitBackground: true
    });
    const firstSample = pngStats(firstCanvasShot);
    const secondSample = pngStats(secondCanvasShot);
    await page.locator("#story-3").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const scrolledCanvasShot = await page.locator("#three-canvas").screenshot({
      path: `test-results/canvas-${viewport.name}-scroll.png`,
      omitBackground: true
    });
    const scrolledSample = pngStats(scrolledCanvasShot);

    await page.locator("#openChat").click();
    await page.locator("#userInput").fill("What services do you offer?");
    await page.locator("#userInput").press("Enter");
    await page.waitForSelector(".message.assistant >> text=financial planning", {
      timeout: 15000
    });

    const chatbox = await page.locator("#chatbox").screenshot({
      path: `test-results/chat-${viewport.name}.png`
    });

    assert(consoleErrors.length === 0, `${viewport.name}: console errors found`);
    assert(info.clientWidth >= viewport.width * 0.9, `${viewport.name}: canvas is not full width`);
    assert(info.clientHeight >= viewport.height * 0.6, `${viewport.name}: canvas is too short`);
    assert(firstSample.visiblePixels > 40, `${viewport.name}: 3D canvas looks blank`);
    assert(
      firstSample.checksum !== secondSample.checksum,
      `${viewport.name}: 3D canvas does not appear to animate`
    );
    assert(
      Math.abs(scrolledSample.checksum - secondSample.checksum) > 100000,
      `${viewport.name}: 3D canvas did not materially react to scroll`
    );
    assert(chatbox.length > 1000, `${viewport.name}: chat screenshot was not captured`);

    results.push({
      viewport: viewport.name,
      canvas: { ...info, ...firstSample },
      animated: firstSample.checksum !== secondSample.checksum,
      scrollDriven: Math.abs(scrolledSample.checksum - secondSample.checksum) > 100000,
      chat: "ok"
    });

    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
