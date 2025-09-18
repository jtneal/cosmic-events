FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx run-many --target=build --projects=web,api
RUN npm prune --production

FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist/apps/api ./dist/api
COPY --from=builder /app/dist/apps/web ./dist/web
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD ["node", "dist/api/main"]
