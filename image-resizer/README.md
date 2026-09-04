# Tool #41 — Image Resizer

A standalone browser-based image resizing tool. It supports JPG, PNG, WebP, and other browser-readable image files.

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

## Included features

Choose an image by file picker or drag and drop it into the page. Enter a target width and height, keep the original aspect ratio when desired, choose JPG, PNG, or WebP output, adjust quality for JPG/WebP, and download the resized image directly.

All file reading and resizing happens in the browser using the Canvas API. The project contains no upload endpoint and does not send image bytes to a server.
