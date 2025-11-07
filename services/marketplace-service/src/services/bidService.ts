//bidService.ts
import { AppDataSource } from "../data-source";
import { Bid } from "../entities/Bid";
import { Listing } from "../entities/Listing";
import * as orderService from "./orderService";
import * as apiClient from "../utils/apiClient";

const bidRepo = () => AppDataSource.getRepository(Bid);
const listingRepo = () => AppDataSource.getRepository(Listing);

export async function placeBid(listingId: string, bidderId: string, amount: number) {
  const listing = await listingRepo().findOneBy({ id: listingId });
  if (!listing) throw new Error("Listing not found");
  if (listing.status === "SOLD") throw new Error("Listing already sold");

  const repo = bidRepo();
  const bid = repo.create({ listing, bidderId, amount });
  return repo.save(bid);
}

export async function getBidsForListing(listingId: string) {
  return bidRepo().find({
    where: { listing: { id: listingId } },
    order: { amount: "DESC" },
  });
}

export async function closeAuction(listingId: string) {
  const repo = bidRepo();
  const listing = await listingRepo().findOne({ where: { id: listingId }, relations: ["bids"] });
  if (!listing) throw new Error("Listing not found");
  if (listing.bids.length === 0) throw new Error("No bids placed");

  // lấy bid cao nhất
  const highestBid = listing.bids.sort((a, b) => b.amount - a.amount)[0];

  // chuyển credits cho người thắng
  await apiClient.transferCredits(listing.userId, highestBid.bidderId, listing.amount);

  // cập nhật trạng thái listing
  listing.status = "SOLD";
  await listingRepo().save(listing);

  // tạo order mới cho người thắng
  const order = await orderService.createOrder(
    highestBid.bidderId,
    listing.userId,
    listing.amount,
    highestBid.amount,
    listing
  );

  return { winner: highestBid, order };
}
