# ------------ NODE ---------------------
FROM node:21.6.2-alpine3.19 AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++ git openssh-client
RUN npm install -g pnpm@9.0.0 nx@20.4.0

FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml* package.json nx.json tsconfig.base.json ./

RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .

RUN pnpm nx run-many --target=build --all --configuration=production
RUN pnpm prune --prod

# ------------ MICROSERVICES ------------
FROM node:21-alpine AS microservices
WORKDIR /app

COPY --from=build /app/pnpm-lock.yaml /app/package.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/nx.json ./

RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001 -G nodejs
RUN chown -R nestjs:nodejs /app
USER nestjs

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

COPY ./start-api.sh ./
#RUN chmod +x start-api.sh

CMD ["start-api.sh"]

# ------------ WEB --------------------------
FROM nginx:alpine AS frontend
COPY --from=build /app/dist/apps/web /usr/share/nginx/html

# Create nginx.conf directly in the Dockerfile
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
