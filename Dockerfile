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

FROM base AS app

COPY --from=builder --exclude=packages/client/dist /app /app
COPY --from=builder /app/packages/client/dist /app/public
EXPOSE 80
CMD ["pnpm", "run", "start"]
