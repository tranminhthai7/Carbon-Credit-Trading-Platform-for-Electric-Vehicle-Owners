import axios from 'axios';
import { envConfig } from '../config/env';

export interface CreditIssuanceRequest {
  user_id: string;
  amount: number;
  verification_id: string;
  co2_amount: number;
  description?: string;
}

export interface WalletResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export class WalletService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = envConfig.WALLET_SERVICE_URL;
    this.apiKey = envConfig.API_SECRET_KEY;
  }

  async issueCredits(request: CreditIssuanceRequest): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/wallet/credits/issue`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Wallet service error:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to issue credits'
      };
    }
  }

  async getUserBalance(userId: string): Promise<WalletResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/wallet/balance/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 5000
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Wallet service error:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get balance'
      };
    }
  }
}