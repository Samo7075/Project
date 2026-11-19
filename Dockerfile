# --- Stage 1: Frontend build (Vite) ---
FROM node:22-bookworm-slim AS Frontend-build
WORKDIR /app/Frontend

COPY Frontend/package*.json ./
RUN npm ci --no-audit --no-fund

COPY Frontend/ ./
ENV VITE_API_URL=
RUN npm run build

# --- Stage 2: Backend build (Express + TypeScript) ---
FROM node:22-bookworm-slim AS Backend-build
WORKDIR /app/Backend

COPY Backend/package*.json ./
RUN npm ci --no-audit --no-fund

COPY Backend/ ./
RUN npm run build

# --- Stage 3: Final Production Image ---
FROM node:22-bookworm-slim
WORKDIR /app

ENV NODE_ENV=production

COPY Backend/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --from=Backend-build /app/Backend/dist ./dist
COPY --from=Frontend-build /app/Frontend/dist ./public

EXPOSE 3000

CMD ["node", "dist/index.js"]
