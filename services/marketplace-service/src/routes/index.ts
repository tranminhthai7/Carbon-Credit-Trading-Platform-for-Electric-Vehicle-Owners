//routes\index.ts
import { Router } from "express";
import { createListingHandler, getAllListingsHandler, buyListingHandler } from "../controllers/listingController";
import { getAllOrdersHandler, updateOrderStatusHandler } from "../controllers/orderController";
import { placeBidHandler, getBidsHandler, closeAuctionHandler } from "../controllers/bidController";

const router = Router();

// Listing routes
router.post("/listings", createListingHandler);//Tạo mới một listing (đăng bán tín chỉ carbon)
router.get("/listings", getAllListingsHandler);//Lấy danh sách tất cả các listing hiện có (chưa bán hoặc đã bán)
router.post("/listings/:id/purchase", buyListingHandler);//Người mua mua trực tiếp listing (giá cố định, không đấu giá)

// Auction routes
router.post("/listings/:id/bid", placeBidHandler); //Người mua đặt giá (bid) cho listing đấu giá
router.get("/listings/:id/bids", getBidsHandler); //Xem tất cả các bid hiện có cho listing đó
router.post("/listings/:id/close", closeAuctionHandler);//Kết thúc phiên đấu giá

// Orders
router.get("/orders", getAllOrdersHandler);//Xem toàn bộ đơn hàng
router.post("/orders/update", updateOrderStatusHandler);//Cập nhật trạng thái đơn hàng

export default router;
