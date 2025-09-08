# Crypto Price API

Dynamic cryptocurrency price API with Docker support.

## Endpoints

- `GET /health` - Health check
- `GET /cryptos` - Get all cryptocurrencies with dynamic prices
- `GET /price/:id` - Get specific cryptocurrency price

## Running with Docker

```bash
# Build and start
docker-compose up --build

# Or manually
docker build -t crypto-price-api .
docker run -p 3000:3000 crypto-price-api
