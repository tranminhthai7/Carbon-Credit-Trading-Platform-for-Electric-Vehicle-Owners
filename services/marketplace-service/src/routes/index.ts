import { Router } from "express";
import { createListingHandler, getAllListingsHandler, buyListingHandler } from "../controllers/listingController";
import { getAllOrdersHandler, updateOrderStatusHandler } from "../controllers/orderController";
import { placeBidHandler, getBidsHandler, closeAuctionHandler } from "../controllers/bidController";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";

const router = Router();

// Listing routes
router.post("/listings", createListingHandler);
router.get("/listings", getAllListingsHandler);
router.post("/listings/:id/purchase", buyListingHandler);

// Auction routes
router.post("/listings/:id/bid", placeBidHandler);
router.get("/listings/:id/bids", getBidsHandler);
router.post("/listings/:id/close", closeAuctionHandler);

// Orders
router.get("/orders", getAllOrdersHandler);
router.post("/orders/update", updateOrderStatusHandler);

// lấy danh sách đơn hàng theo buyerId, đồng thời join với entity listing và sắp xếp theo createdAt
router.get("/orders/buyer/:buyerId", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      where: { buyerId: req.params.buyerId },
      relations: ["listing"],
      order: { createdAt: "DESC" }
    });
    res.json(orders);
  } catch (err: any) {
    console.error("Error fetching buyer orders:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;