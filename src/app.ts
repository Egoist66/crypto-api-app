import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { PriceController } from './controllers/priceController';
import { cacheMiddleware } from './middleware/cache';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Dynamic Crypto Price API'
  });
});

// Get all cryptocurrencies with dynamic prices
app.get('/cryptos', cacheMiddleware, PriceController.getAllCryptos);

// Get specific cryptocurrency price
app.get('/price/:id', cacheMiddleware, PriceController.getPrice);

// 404 handler - исправляем проблему с wildcard
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

export default app;