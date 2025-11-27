//listingController.ts
console.log("listingController loaded");
import { Request, Response } from "express";
import * as listingService from "../services/listingService";
console.log("listingService imported successfully");
setTimeout(() => console.log("updateListing function:", typeof listingService.updateListing), 100);

export async function createListingHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { amount, pricePerCredit, type } = req.body;
    if (!amount || !pricePerCredit) {
      return res.status(400).json({ error: "amount, pricePerCredit required" });
    }
    const listingType = type === "AUCTION" ? "AUCTION" : "FIXED_PRICE";
    const listing = await listingService.createListing(userId, amount, pricePerCredit, listingType);
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
    const { buyerId, quantity } = req.body;

    if (!listingId || !buyerId || !quantity)
      return res.status(400).json({ error: "listingId, buyerId and quantity required" });

    const result = await listingService.buyListing(listingId, buyerId, quantity);
    res.json(result.order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}

export async function updateListingHandler(req: Request, res: Response) {
  try {
    console.log("updateListingHandler called", req.params.id, req.body);
    const listingId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { pricePerCredit } = req.body;
    if (!listingId) return res.status(400).json({ error: "Listing id required" });
    if (pricePerCredit === undefined) return res.status(400).json({ error: "pricePerCredit required" });
    console.log("Calling updateListing", listingId, { pricePerCredit: Number(pricePerCredit) });
    const listingService = require("../services/listingService");
    console.log("listingService keys in handler:", Object.keys(listingService));
    const listing = await listingService.updateListing(listingId, userId, { pricePerCredit: Number(pricePerCredit) });
    console.log("updateListing result", listing);
    res.json(listing);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("updateListingHandler error", message);
    res.status(400).json({ error: message });
  }
}

export async function cancelListingHandler(req: Request, res: Response) {
  try {
    const listingId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!listingId) return res.status(400).json({ error: "Listing id required" });
    const listing = await listingService.cancelListing(listingId, userId);
    res.json(listing);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}

