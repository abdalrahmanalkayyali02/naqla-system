# ── Stage 1: Builder ──────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx ng build --configuration=production

# ── Stage 2: Production Nginx ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Write Nginx config listening on port 3012 for Angular SPA
RUN printf 'server {\n\
    listen 3012;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location ~* \\.(js|css|png|jpg|ico|woff2?)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public";\n\
    }\n\
\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript;\n\
}\n' > /etc/nginx/conf.d/default.conf

# Copy compiled Angular browser bundle
COPY --from=builder /app/dist/naqla-admin-portal/browser /usr/share/nginx/html

EXPOSE 3012

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3012/ || exit 1

CMD ["nginx", "-g", "daemon off;"]