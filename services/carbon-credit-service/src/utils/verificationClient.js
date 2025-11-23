"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitVerification = submitVerification;
const axios_1 = __importDefault(require("axios"));
const client = axios_1.default.create({
    baseURL: process.env.VERIFICATION_SERVICE_URL || 'http://verification-service:3004',
    timeout: 5000,
});
async function submitVerification(payload) {
    return client.post('/credits/verify', payload);
}
exports.default = { submitVerification };
