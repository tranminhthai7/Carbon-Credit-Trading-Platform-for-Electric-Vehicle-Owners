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
exports.createListingHandler = createListingHandler;
exports.getAllListingsHandler = getAllListingsHandler;
exports.buyListingHandler = buyListingHandler;
const listingService = __importStar(require("../services/listingService"));
async function createListingHandler(req, res) {
    try {
        const { userId, amount, pricePerCredit } = req.body;
        if (!userId || !amount || !pricePerCredit) {
            return res.status(400).json({ error: "userId, amount, pricePerCredit required" });
        }
        const listing = await listingService.createListing(userId, amount, pricePerCredit);
        res.json(listing);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function getAllListingsHandler(req, res) {
    const listings = await listingService.getAllListings();
    res.json(listings);
}
async function buyListingHandler(req, res) {
    try {
        // lấy id từ URL params
        const listingId = req.params.id;
        const { buyerId } = req.body;
        if (!listingId || !buyerId)
            return res.status(400).json({ error: "listingId and buyerId required" });
        const result = await listingService.buyListing(listingId, buyerId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
