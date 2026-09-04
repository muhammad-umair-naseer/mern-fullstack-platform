# Tool #53 — Image Enlarger

A simple standalone browser tool for enlarging small or low-resolution images.

## Run locally

```bash
pnpm install
pnpm dev
```

For a production build:

```bash
pnpm build
pnpm preview
```

## How it works

Choose or drop an image, select 2× or 4× enlargement, choose JPG, PNG, or WebP output, optionally enable local clarity enhancement, and download the result. Enlargement uses high-quality browser Canvas interpolation. The optional clarity mode applies a local sharpening pass; it is not a cloud AI service. PNG/WebP output retains transparency, and no image bytes are uploaded to a server.
