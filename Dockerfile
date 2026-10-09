# ── Étape 1 : compilation TypeScript ────────────────────────
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
# tsc produit dist/, puis on retire les dépendances de développement
RUN npm run build && npm prune --omit=dev

# ── Étape 2 : image finale ──────────────────────────────────
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
# Images, SVG et CV servis par l'API (/images, /svg, /documents)
COPY public ./public

# Ne pas tourner en root
USER node

# Doit correspondre à la variable PORT passée au conteneur
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Les secrets (.env) ne sont pas dans l'image : ils sont passés au
# lancement avec --env-file.
CMD ["node", "dist/server.js"]
