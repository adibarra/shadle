#  syntax=docker/dockerfile:1-labs
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/config/package.json packages/config/
COPY packages/constants/package.json packages/constants/
COPY packages/database/package.json packages/database/
COPY packages/logger/package.json packages/logger/
COPY packages/types/package.json packages/types/
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/

RUN pnpm install --frozen-lockfile

FROM deps AS builder

ARG COMMIT_HASH=unknown
ENV COMMIT_HASH=${COMMIT_HASH}
ENV CI=true

COPY . .

RUN pnpm --parallel run test
RUN pnpm --filter @shadle/client run build

FROM adibarra/nginx-static:latest AS client

COPY nginx.conf /usr/local/nginx/conf/nginx.conf
COPY --from=builder /app/packages/client/dist /srv
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]

FROM base AS server

COPY --from=builder --exclude=packages/client/dist /app /app
EXPOSE 80
CMD ["pnpm", "run", "start"]
