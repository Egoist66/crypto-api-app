import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Crypto Price API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💵 All cryptos: http://localhost:${PORT}/cryptos`);
  console.log(`💰 Specific crypto: http://localhost:${PORT}/price/bitcoin`);
});