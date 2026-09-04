# Tool #59 — QR Generator

A simple standalone browser tool for creating QR codes for URLs, plain text, Wi-Fi networks, and contact cards.

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

Choose a QR type, fill in the fields, review the live preview, and download a PNG. Wi-Fi and contact values are encoded using standard QR payload formats. Generation is performed locally in the browser with QRCode.js; no content is uploaded to a server.
