import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheItem>();

/**
 * Cache middleware to cache GET requests for individual cryptos and all cryptos.
 *
 * Checks if the request is cached and if the cache is valid (i.e. the cache
 * has not expired). If the cache is valid, it returns the cached data. If the
 * cache is invalid, it lets the request pass through and updates the cache
 * with the response.
 *
 * @param {Request} req The request object.
 * @param {Response} res The response object.
 * @param {NextFunction} next The next middleware function.
 */

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