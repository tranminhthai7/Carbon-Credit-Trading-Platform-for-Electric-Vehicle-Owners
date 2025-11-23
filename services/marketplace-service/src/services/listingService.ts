//listingService.ts
console.log("listingService loaded");

import { transferCredits } from "../utils/apiClient";
import { createOrder } from "./orderService";
import { AppDataSource } from "../db";
import { Listing } from "../entities/Listing";

console.log("AppDataSource imported:", !!AppDataSource);

export const test = () => "test";

const listingRepo = () => AppDataSource.getRepository('Listing' as any);

export async function createListing(userId: string, amount: number, pricePerCredit: number) {
  const repo = listingRepo();
  const listing = repo.create({ userId, amount, pricePerCredit, status: "OPEN" });
  return repo.save(listing);
}

export async function getAllListings() {
  const repo = listingRepo();
  return repo.find();
}

export async function getListingById(listingId: string) {
  const repo = listingRepo();
  return repo.findOneBy({ id: listingId });
}

export async function getUserListings(userId: string) {
  const repo = listingRepo();
  return repo.find({ where: { userId } });
}

export async function buyListing(listingId: string, buyerId: string) {
  const repo = listingRepo();
  const listing = await repo.findOneBy({ id: listingId });

  if (!listing) throw new Error("Listing not found");
  if (listing.status === "SOLD") throw new Error("Already sold");

  // Transfer credits first
  const transferResult: any = await transferCredits(listing.userId, buyerId, listing.amount);
  if (!transferResult || transferResult.status < 200 || transferResult.status >= 300 || transferResult.data?.success === false) {
    throw new Error((transferResult && (transferResult.data?.message || transferResult.statusText)) || "Transfer failed");
  }

  // Use DB transaction to mark listing as sold and create order atomically
  const result = await AppDataSource.transaction(async (manager) => {
    listing.status = "SOLD";
    await manager.save(listing);

    const order = await createOrder(
      buyerId,
      listing.userId,
      listing.amount,
      listing.pricePerCredit,
      listing.id,
      manager
    );

    return { listing, order };
  });

  return result;
}

export const testFunction = () => "test";

