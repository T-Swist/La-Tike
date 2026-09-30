# ---------- Build stage: compile TypeScript and generate the Prisma client ----------
FROM node:22-alpine AS build

WORKDIR /app

# Prisma's query engine needs OpenSSL on Alpine
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Runtime stage: production dependencies + compiled output only ----------
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

# The official image ships a non-root "node" user
RUN mkdir -p logs && chown -R node:node /app
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node dist/healthcheck.js || exit 1

# Apply pending migrations, then start the API
CMD ["npm", "run", "start:docker"]
