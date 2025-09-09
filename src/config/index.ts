export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  cacheTTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 60000
};


console.log(config);