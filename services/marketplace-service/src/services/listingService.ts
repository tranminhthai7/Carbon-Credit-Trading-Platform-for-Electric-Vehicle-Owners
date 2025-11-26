//listingService.ts
console.log("LISTING SERVICE MODULE LOADED AT:", new Date().toISOString());

import { transferCredits } from "../utils/apiClient";
import { createOrder } from "./orderService";
import { AppDataSource } from "../db";
import { Listing } from "../entities/Listing";

console.log("AppDataSource imported:", !!AppDataSource);
console.log("AppDataSource initialized:", AppDataSource?.isInitialized);

export const test = () => "test";

const getListingRepo = () => {
  console.log("getListingRepo called at", new Date().toISOString());
  console.log("AppDataSource instance:", AppDataSource);
  if (!AppDataSource) throw new Error("AppDataSource not initialized");
  console.log("AppDataSource has metadata:", AppDataSource.hasMetadata(Listing));
  console.log("AppDataSource entity metadatas:", AppDataSource.entityMetadatas.map(m => m.name));
  return AppDataSource.getRepository(Listing);
};

export async function createListing(userId: string, amount: number, pricePerCredit: number) {
  const repo = getListingRepo();
  const listing = repo.create({ userId, amount, pricePerCredit, status: "OPEN" });
  return repo.save(listing);
}

export async function getAllListings() {
  const repo = getListingRepo();
  return repo.find();
}

export async function getListingById(listingId: string) {
  const repo = getListingRepo();
  return repo.findOneBy({ id: listingId });
}

export async function getUserListings(userId: string) {
  console.log("=== getUserListings START ===");
  console.log("getUserListings called with userId:", userId);
  console.log("AppDataSource in getUserListings:", AppDataSource);
  console.log("AppDataSource initialized in getUserListings:", AppDataSource?.isInitialized);
  const repo = getListingRepo();
  console.log("repo:", repo);
  return repo.find({ where: { userId } });
}

export async function buyListing(listingId: string, buyerId: string, quantity: number) {
  const repo = getListingRepo();
  const listing = await repo.findOneBy({ id: listingId });

  if (!listing) throw new Error("Listing not found");
  if (listing.status === "SOLD") throw new Error("Already sold");
  if (quantity > listing.amount) throw new Error("Quantity exceeds available amount");

  // Transfer credits first
  const transferResult: any = await transferCredits(listing.userId, buyerId, quantity);
  if (!transferResult || transferResult.status < 200 || transferResult.status >= 300 || transferResult.data?.success === false) {
    throw new Error((transferResult && (transferResult.data?.message || transferResult.statusText)) || "Transfer failed");
  }

  // Use DB transaction to update listing and create order atomically
  const result = await AppDataSource.transaction(async (manager) => {
    listing.amount -= quantity;
    if (listing.amount === 0) {
      listing.status = "SOLD";
    }
    await manager.save(listing);

    const order = await createOrder(
      buyerId,
      listing.userId,
      quantity,
      listing.pricePerCredit,
      listing.id,
      manager
    );

    return { listing, order };
  });

  return result;
}

export const testFunction = () => "test";

