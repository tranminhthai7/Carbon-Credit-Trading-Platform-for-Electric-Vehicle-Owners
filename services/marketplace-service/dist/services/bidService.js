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
exports.placeBid = placeBid;
exports.getBidsForListing = getBidsForListing;
exports.closeAuction = closeAuction;
//bidService.ts
const data_source_1 = require("../data-source");
const Bid_1 = require("../entities/Bid");
const Listing_1 = require("../entities/Listing");
const orderService = __importStar(require("./orderService"));
const apiClient = __importStar(require("../utils/apiClient"));
const bidRepo = () => data_source_1.AppDataSource.getRepository(Bid_1.Bid);
const listingRepo = () => data_source_1.AppDataSource.getRepository(Listing_1.Listing);
async function placeBid(listingId, bidderId, amount) {
    const listing = await listingRepo().findOneBy({ id: listingId });
    if (!listing)
        throw new Error("Listing not found");
    if (listing.status === "SOLD")
        throw new Error("Listing already sold");
    const repo = bidRepo();
    const bid = repo.create({ listing, bidderId, amount });
    return repo.save(bid);
}
async function getBidsForListing(listingId) {
    return bidRepo().find({
        where: { listing: { id: listingId } },
        order: { amount: "DESC" },
    });
}
async function closeAuction(listingId) {
    const repo = bidRepo();
    const listing = await listingRepo().findOne({ where: { id: listingId }, relations: ["bids"] });
    if (!listing)
        throw new Error("Listing not found");
    if (listing.bids.length === 0)
        throw new Error("No bids placed");
    // lấy bid cao nhất
    const highestBid = listing.bids.sort((a, b) => b.amount - a.amount)[0];
    // chuyển credits cho người thắng
    await apiClient.transferCredits(listing.userId, highestBid.bidderId, listing.amount);
    // cập nhật trạng thái listing
    listing.status = "SOLD";
    await listingRepo().save(listing);
    // tạo order mới cho người thắng
    const order = await orderService.createOrder(highestBid.bidderId, listing.userId, listing.amount, highestBid.amount, listing);
    return { winner: highestBid, order };
}
