"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
class WalletService {
    constructor() {
        this.baseURL = env_1.envConfig.WALLET_SERVICE_URL;
        this.apiKey = env_1.envConfig.API_SECRET_KEY;
    }
    async issueCredits(request) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/api/wallet/credits/issue`, request, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            console.error('Wallet service error:', error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to issue credits'
            };
        }
    }
    async getUserBalance(userId) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/api/wallet/balance/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                timeout: 5000
            });
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            console.error('Wallet service error:', error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to get balance'
            };
        }
    }
}
exports.WalletService = WalletService;
