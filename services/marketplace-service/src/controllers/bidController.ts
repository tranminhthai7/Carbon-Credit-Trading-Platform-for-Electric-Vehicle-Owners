import { Request, Response } from "express";
import * as bidService from "../services/bidService";

export async function placeBidHandler(req: Request, res: Response) {
  try {
    const listingId = req.params.id;
    const { bidderId, amount } = req.body;
    if (!listingId || !bidderId || !amount)
      return res.status(400).json({ error: "listingId, bidderId, amount required" });

    const bid = await bidService.placeBid(listingId, bidderId, amount);
    res.json(bid);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getBidsHandler(req: Request, res: Response) {
  const listingId = req.params.id;
  const bids = await bidService.getBidsForListing(listingId);
  res.json(bids);
}

export async function closeAuctionHandler(req: Request, res: Response) {
  try {
    const listingId = req.params.id;
    const result = await bidService.closeAuction(listingId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
