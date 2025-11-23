"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferCredits = transferCredits;
//apiClient.ts
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: process.env.CARBON_CREDIT_SERVICE_URL || "http://carbon-credit-service:3003",
    timeout: 5000,
});
async function transferCredits(fromUserId, toUserId, amount) {
    return api.post("/wallet/transfer", { fromUserId, toUserId, amount });
}
