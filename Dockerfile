FROM node:20-alpine as builder
RUN corepack enable pnpm
WORKDIR /app
COPY . .
RUN pnpm install \
  && pnpm run build

FROM --platform=linux/amd64 node:20-bullseye-slim AS deploy

WORKDIR /app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json /app/pnpm-lock.yaml .
COPY --from=builder /app/dist ./dist
ENV PUPPETEER_SKIP_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable
RUN corepack enable pnpm \
  && pnpm install --prod

EXPOSE 3000
CMD ["node", "dist/index"]