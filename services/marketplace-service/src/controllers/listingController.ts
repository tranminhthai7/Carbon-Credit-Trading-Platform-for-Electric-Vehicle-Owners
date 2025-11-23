//listingController.ts
console.log("listingController loaded");
import { Request, Response } from "express";
import * as listingService from "../services/listingService";
console.log("listingService imported successfully");

export async function createListingHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { quantity, pricePerUnit } = req.body;
    if (!quantity || !pricePerUnit) {
      return res.status(400).json({ error: "quantity, pricePerUnit required" });
    }
    const listing = await listingService.createListing(userId, quantity, pricePerUnit);
    res.json(listing);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
}

export async function getAllListingsHandler(req: Request, res: Response) {
  try {
    const listings = await listingService.getAllListings();
    res.json(listings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
}

export async function getListingByIdHandler(req: Request, res: Response) {
  try {
    const listingId = req.params.id;
    if (!listingId) return res.status(400).json({ error: "Listing id required" });
    const listing = await listingService.getListingById(listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
}

export async function getMyListingsHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    console.log("getMyListingsHandler called with userId:", userId);
    console.log("listingService keys:", Object.keys(listingService));
    console.log("has getUserListings:", typeof listingService.getUserListings);
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const listings = await listingService.getUserListings(userId);
    res.json(listings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error in getMyListingsHandler:", err);
    res.status(500).json({ error: message });
  }
}

export async function buyListingHandler(req: Request, res: Response) {
  try {
    // lấy id từ URL params
    const listingId = req.params.id;
    const { buyerId } = req.body;

    if (!listingId || !buyerId)
      return res.status(400).json({ error: "listingId and buyerId required" });

    const result = await listingService.buyListing(listingId, buyerId);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}

