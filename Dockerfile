#  syntax=docker/dockerfile:1-labs
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

FROM base AS deps

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY pnpm-workspace.yaml package.json ./
COPY --parents packages/*/package.json ./
RUN pnpm install --frozen-lockfile --offline

FROM deps AS builder

ARG COMMIT_HASH=unknown
ENV COMMIT_HASH=${COMMIT_HASH}
ENV CI=true

COPY . .

RUN pnpm run test
RUN pnpm run build

FROM adibarra/nginx-static:latest AS client

COPY nginx.conf /usr/local/nginx/conf/nginx.conf
COPY --from=builder /app/packages/client/dist /srv
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]

FROM base AS server

COPY --from=builder --exclude=packages/client/dist /app /app
EXPOSE 81
CMD ["pnpm", "run", "start"]
