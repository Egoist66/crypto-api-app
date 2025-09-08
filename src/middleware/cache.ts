import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheItem>();

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const cacheKey = id ? `crypto_${id}` : 'all_cryptos';
  const cachedItem = cache.get(cacheKey);

  if (cachedItem && (Date.now() - cachedItem.timestamp) < config.cacheTTL) {
    console.log(`Cache hit for ${cacheKey}`);
    return res.json(cachedItem.data);
  }

  console.log(`Cache miss for ${cacheKey}`);
  next();
};

export const setCache = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};