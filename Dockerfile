FROM node:lts-alpine

WORKDIR /app

# Обновляем систему
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Копируем ВСЕ файлы из текущей директории в /app
COPY . .

# Устанавливаем зависимости, собираем и очищаем
RUN npm ci && \
    npm run build && \
    npm prune --production && \
    rm -rf /root/.npm /tmp/*

# Создаем non-root пользователя
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]