import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PriceController } from './controllers/priceController';
import { cacheMiddleware } from './middleware/cache';
import { config } from './config';

const app = express();



app.use(helmet());
app.use(cors({
  origin: config.allowedOrigins,
  credentials: false,
  
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {

  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Dynamic Crypto Price API'
  });
});

app.get('/cryptos', cacheMiddleware, PriceController.getAllCryptos);
app.get('/price/:id', cacheMiddleware, PriceController.getPrice);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

export default app;