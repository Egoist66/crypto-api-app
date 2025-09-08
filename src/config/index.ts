// Убираем dotenv для production, используем только переменные окружения
export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  cacheTTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 60000
};