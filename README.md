# AllFinanz 3D Website

Premium scroll-driven website for AllFinanz Consulting Ltd built with Next.js App Router, TypeScript, Tailwind CSS, React Three Fiber, Drei, Three.js, and GSAP ScrollTrigger.

## Run Locally

Install packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000/
```

Build the production site:

```bash
npm run build
```

## Development

Visual smoke checks expect the Next.js server to be running on port 3000:

```bash
npm run test:visual
```

## Notes

- The chatbot is implemented as a Next.js API route at `/api/chatbot`.
- Contact is phone-first: `+230 2105209`.
- If a `.glb` model is later added to `public/models/`, the 3D scene can be swapped from the abstract object to the model.
