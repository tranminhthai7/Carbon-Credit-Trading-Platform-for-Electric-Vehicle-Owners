"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletHandler = createWalletHandler;
exports.getWalletHandler = getWalletHandler;
exports.mintHandler = mintHandler;
exports.transferHandler = transferHandler;
const walletService = __importStar(require("../services/walletService"));
async function createWalletHandler(req, res) {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId required' });
        const wallet = await walletService.createWallet(userId);
        res.json(wallet);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}
async function getWalletHandler(req, res) {
    try {
        const userId = req.params.userId;
        const wallet = await walletService.getWalletByUserId(userId);
        if (!wallet)
            return res.status(404).json({ error: 'Wallet not found' });
        res.json(wallet);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}
async function mintHandler(req, res) {
    try {
        const { userId, amount } = req.body;
        if (!userId || typeof amount !== 'number')
            return res.status(400).json({ error: 'userId and numeric amount required' });
        const result = await walletService.mintCredits(userId, amount);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message || 'Error' });
    }
}
async function transferHandler(req, res) {
    try {
        const { fromUserId, toUserId, amount } = req.body;
        if (!fromUserId || !toUserId || typeof amount !== 'number')
            return res.status(400).json({ error: 'fromUserId, toUserId and numeric amount required' });
        const result = await walletService.transferCredits(fromUserId, toUserId, amount);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message || 'Error' });
    }
}
