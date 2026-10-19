#  syntax=docker/dockerfile:1-labs
FROM oven/bun:1.4.3-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package.json bun.lock bunfig.toml ./
COPY --parents packages/*/package.json ./
RUN bun install --frozen-lockfile

FROM deps AS builder

ARG COMMIT_HASH=unknown
ENV COMMIT_HASH=${COMMIT_HASH}
ENV CI=true

COPY . .

RUN bun run test
RUN bun run build

FROM adibarra/nginx-static:latest AS client

COPY nginx.conf /usr/local/nginx/conf/nginx.conf
COPY --from=builder /app/packages/client/dist /srv
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]

FROM base AS prod-deps

COPY package.json bun.lock bunfig.toml ./
COPY --parents packages/*/package.json ./
RUN bun install --frozen-lockfile --production --filter @shadle/server

FROM base AS server

ENV NODE_ENV=prod
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./
COPY --parents packages/config/package.json packages/config/src \
  packages/constants/package.json packages/constants/src \
  packages/database/package.json packages/database/src \
  packages/logger/package.json packages/logger/src \
  packages/server/package.json packages/server/src \
  packages/types/package.json packages/types/src ./
EXPOSE 81
CMD ["bun", "packages/server/src/index.ts"]
