"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFunction = exports.test = void 0;
exports.createListing = createListing;
exports.getAllListings = getAllListings;
exports.getListingById = getListingById;
exports.getUserListings = getUserListings;
exports.buyListing = buyListing;
//listingService.ts
console.log("LISTING SERVICE MODULE LOADED AT:", new Date().toISOString());
const apiClient_1 = require("../utils/apiClient");
const orderService_1 = require("./orderService");
const db_1 = require("../db");
const Listing_1 = require("../entities/Listing");
console.log("AppDataSource imported:", !!db_1.AppDataSource);
console.log("AppDataSource initialized:", db_1.AppDataSource?.isInitialized);
const test = () => "test";
exports.test = test;
const getListingRepo = () => {
    console.log("getListingRepo called at", new Date().toISOString());
    console.log("AppDataSource instance:", db_1.AppDataSource);
    if (!db_1.AppDataSource)
        throw new Error("AppDataSource not initialized");
    console.log("AppDataSource has metadata:", db_1.AppDataSource.hasMetadata(Listing_1.Listing));
    console.log("AppDataSource entity metadatas:", db_1.AppDataSource.entityMetadatas.map(m => m.name));
    return db_1.AppDataSource.getRepository(Listing_1.Listing);
};
async function createListing(userId, amount, pricePerCredit) {
    const repo = getListingRepo();
    const listing = repo.create({ userId, amount, pricePerCredit, status: "OPEN" });
    return repo.save(listing);
}
async function getAllListings() {
    const repo = getListingRepo();
    return repo.find();
}
async function getListingById(listingId) {
    const repo = getListingRepo();
    return repo.findOneBy({ id: listingId });
}
async function getUserListings(userId) {
    console.log("=== getUserListings START ===");
    console.log("getUserListings called with userId:", userId);
    console.log("AppDataSource in getUserListings:", db_1.AppDataSource);
    console.log("AppDataSource initialized in getUserListings:", db_1.AppDataSource?.isInitialized);
    const repo = getListingRepo();
    console.log("repo:", repo);
    return repo.find({ where: { userId } });
}
async function buyListing(listingId, buyerId, quantity) {
    const repo = getListingRepo();
    const listing = await repo.findOneBy({ id: listingId });
    if (!listing)
        throw new Error("Listing not found");
    if (listing.status === "SOLD")
        throw new Error("Already sold");
    if (quantity > listing.amount)
        throw new Error("Quantity exceeds available amount");
    // Transfer credits first
    const transferResult = await (0, apiClient_1.transferCredits)(listing.userId, buyerId, quantity);
    if (!transferResult || transferResult.status < 200 || transferResult.status >= 300 || transferResult.data?.success === false) {
        throw new Error((transferResult && (transferResult.data?.message || transferResult.statusText)) || "Transfer failed");
    }
    // Use DB transaction to update listing and create order atomically
    const result = await db_1.AppDataSource.transaction(async (manager) => {
        listing.amount -= quantity;
        if (listing.amount === 0) {
            listing.status = "SOLD";
        }
        await manager.save(listing);
        const order = await (0, orderService_1.createOrder)(buyerId, listing.userId, quantity, listing.pricePerCredit, listing.id, manager);
        return { listing, order };
    });
    return result;
}
const testFunction = () => "test";
exports.testFunction = testFunction;
