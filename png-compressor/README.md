# Tool #49 — PNG Compressor

A simple standalone browser tool for reducing PNG file size while preserving transparent backgrounds.

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

Choose or drop a PNG, select Lossless, Balanced, or Strong compression, review the original and compressed sizes, and download the optimized PNG. Compression runs in the browser with UPNG.js. The app decodes the PNG to RGBA pixels before encoding it again, so the alpha channel is retained and no image bytes are uploaded to a server.
