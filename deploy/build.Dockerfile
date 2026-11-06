# Throwaway build environment for the website, used by deploy/server/remote-deploy.sh.
# Node 24 (what client/package.json requires) plus Chromium for the SEO
# prerender, so neither has to be installed on the server itself. The repo is
# mounted at /src when it runs; nothing from it is baked into this image.
FROM node:24-bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-noto-core fonts-noto-color-emoji ca-certificates \
 && rm -rf /var/lib/apt/lists/*
ENV CHROME_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_DOWNLOAD=true \
    npm_config_update_notifier=false \
    npm_config_fund=false
WORKDIR /src/client
