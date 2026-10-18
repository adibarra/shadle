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

FROM base AS server

COPY --from=builder --exclude=packages/client/dist /app /app
EXPOSE 81
CMD ["bun", "run", "start"]
