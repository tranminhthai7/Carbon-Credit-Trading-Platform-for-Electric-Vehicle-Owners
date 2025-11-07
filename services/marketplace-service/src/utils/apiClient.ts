//apiClient.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.CARBON_CREDIT_SERVICE_URL || "http://carbon-credit-service:3003",
  timeout: 5000,
});

export async function transferCredits(fromUserId: string, toUserId: string, amount: number) {
  return api.post("/wallet/transfer", { fromUserId, toUserId, amount });
}
