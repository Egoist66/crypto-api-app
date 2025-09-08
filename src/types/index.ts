export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  basePrice: number;
  volatility: number;
}

export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  lastUpdated: string;
}

export interface CryptocurrenciesData {
  cryptocurrencies: CryptoData[];
}

export interface ApiResponse {
  success: boolean;
  data?: CryptoPrice | CryptoPrice[];
  error?: string;
}