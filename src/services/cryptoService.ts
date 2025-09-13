import { CryptoPrice, CryptocurrenciesData, ApiResponse } from '../types';
import { setCache } from '../middleware/cache';

import cryptocurrenciesData from '../data/cryptocurrencies.json';

/**
 * Service for generating dynamic cryptocurrency prices.
 * Reads the cryptocurrency data from a json file and
 * stores it in memory. The prices are then calculated
 * dynamically with a random percentage change based
 * on the volatility of the crypto.
 *
 * @class CryptoService
 */

export class CryptoService {
  private cryptoData: CryptocurrenciesData;
  private previousPrices: Map<string, number>;

  constructor() {
    


    this.cryptoData = cryptocurrenciesData;
    this.previousPrices = new Map();
    this.initializePrices();
  }

  private initializePrices(): void {
    this.cryptoData.cryptocurrencies.forEach(crypto => {
      this.previousPrices.set(crypto.id, crypto.basePrice);
    });
  }

  private generateDynamicPrice(basePrice: number, volatility: number): number {
    const changePercent = (Math.random() * 2 - 1) * volatility;
    const newPrice = basePrice * (1 + changePercent);
    const decimals = basePrice < 1 ? 6 : 2;
    return parseFloat(newPrice.toFixed(decimals));
  }

  private calculatePriceChange(currentPrice: number, previousPrice: number) {
    const change = currentPrice - previousPrice;
    const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
    
    return {
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }

  async getCryptoPrice(id: string): Promise<ApiResponse> {
    try {
      const cryptoData = this.cryptoData.cryptocurrencies.find(
        c => c.id.toLowerCase() === id.toLowerCase()
      );

      if (!cryptoData) {
        const availableIds = this.cryptoData.cryptocurrencies.map(c => c.id).join(', ');
        return {
          success: false,
          error: `Cryptocurrency '${id}' not found. Available: ${availableIds}`
        };
      }

      const previousPrice = this.previousPrices.get(id) || cryptoData.basePrice;
      const currentPrice = this.generateDynamicPrice(cryptoData.basePrice, cryptoData.volatility);
      
      const { change, changePercent } = this.calculatePriceChange(currentPrice, previousPrice);

      this.previousPrices.set(id, currentPrice);

      const cryptoPrice: CryptoPrice = {
        id: cryptoData.id,
        name: cryptoData.name,
        symbol: cryptoData.symbol,
        price: currentPrice,
        priceChange: change,
        priceChangePercent: changePercent,
        lastUpdated: new Date().toISOString(),
        icon: cryptoData.icon,
        fullName: cryptoData.fullName
      };

      setCache(`crypto_${id}`, { success: true, data: cryptoPrice });

      return {
        success: true,
        data: cryptoPrice
      };
    } catch (error: any) {
      console.error('Error fetching crypto price:', error.message);
      return {
        success: false,
        error: 'Failed to fetch cryptocurrency data'
      };
    }
  }

  async getAllCryptocurrencies(): Promise<ApiResponse> {
    try {
      const prices: CryptoPrice[] = [];
      
      for (const cryptoData of this.cryptoData.cryptocurrencies) {
        const previousPrice = this.previousPrices.get(cryptoData.id) || cryptoData.basePrice;
        const currentPrice = this.generateDynamicPrice(cryptoData.basePrice, cryptoData.volatility);
        
        const { change, changePercent } = this.calculatePriceChange(currentPrice, previousPrice);

        this.previousPrices.set(cryptoData.id, currentPrice);

        prices.push({
          id: cryptoData.id,
          name: cryptoData.name,
          symbol: cryptoData.symbol,
          price: currentPrice,
          priceChange: change,
          priceChangePercent: changePercent,
          lastUpdated: new Date().toISOString(),
          icon: cryptoData.icon,
          fullName: cryptoData.fullName
        });
      }

      setCache('all_cryptos', { success: true, data: prices });

      return {
        success: true,
        data: prices
      };
    } catch (error: any) {
      console.error('Error fetching all cryptocurrencies:', error.message);
      return {
        success: false,
        error: 'Failed to fetch cryptocurrencies data'
      };
    }
  }
}