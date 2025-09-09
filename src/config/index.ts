import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
       // Разрешаем запросы без origin (например, из postman, curl)
    if (!requestOrigin) {
      return callback(null, true);
    }

   
    // Проверяем, есть ли origin в списке разрешенных
    if (config.allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      // Если ALLOWED_ORIGINS не задан в .env, разрешаем все домены
      if (!process.env.ALLOWED_ORIGINS) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
}


export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001', 'http://razormxc.beget.tech'],
  cacheTTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 60000
};


