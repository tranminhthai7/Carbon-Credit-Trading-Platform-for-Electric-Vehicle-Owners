//listingService.ts
import { AppDataSource } from "../data-source";
import { Listing } from "../entities/Listing";
import * as apiClient from "../utils/apiClient";
import * as orderService from "./orderService";

const listingRepo = () => AppDataSource.getRepository(Listing);

export async function createListing(userId: string, amount: number, pricePerCredit: number) {
  const repo = listingRepo();
  const listing = repo.create({ userId, amount, pricePerCredit, status: "OPEN" });
  return repo.save(listing);
}

export async function getAllListings() {
  const repo = listingRepo();
  return repo.find();
}

export async function buyListing(listingId: string, buyerId: string) {
  const repo = listingRepo();
  const listing = await repo.findOneBy({ id: listingId });

  if (!listing) throw new Error("Listing not found");
  if (listing.status === "SOLD") throw new Error("Already sold");

  // Chuyển credits qua carbon-credit-service
  await apiClient.transferCredits(listing.userId, buyerId, listing.amount);

  listing.status = "SOLD";
  await repo.save(listing);

  // Tạo đơn hàng mới
  const order = await orderService.createOrder(
    buyerId,
    listing.userId,
    listing.amount,
    listing.pricePerCredit,
    listing
  );

  return { listing, order };
}

