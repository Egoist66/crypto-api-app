import { Request, Response } from "express";
import { CryptoService } from "../services/cryptoService";


/**
 * The PriceController class provides methods for retrieving cryptocurrency prices.
 */

export class PriceController {
  private cryptoService: CryptoService;

  private constructor() {
    this.cryptoService = new CryptoService();
  }

  static get cryptoService(): CryptoService {
    return new PriceController().cryptoService;
  }
  static async getPrice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: "Cryptocurrency ID is required",
        });
        return;
      }

      const result = await PriceController.cryptoService.getCryptoPrice(id.toLowerCase());

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error,
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error("Error in price controller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  static async getAllCryptos(req: Request, res: Response): Promise<void> {
    try {
      const result = await PriceController.cryptoService.getAllCryptocurrencies();

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: result.error,
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error("Error getting all cryptocurrencies:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
