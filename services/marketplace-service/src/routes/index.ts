//routes\index.ts
import { Router } from "express";
import { createListingHandler, getAllListingsHandler, getListingByIdHandler, getMyListingsHandler, buyListingHandler } from "../controllers/listingController";
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { getAllOrdersHandler, getSellerOrdersHandler, updateOrderStatusHandler } from "../controllers/orderController";
import { placeBidHandler, getBidsHandler, closeAuctionHandler } from "../controllers/bidController";

const router = Router();

// Listing routes
router.post("/listings", authMiddleware, requireRole(['ev_owner']), createListingHandler);//Tạo mới một listing (đăng bán tín chỉ carbon)
router.get("/listings", getAllListingsHandler);//Lấy danh sách tất cả các listing hiện có (chưa bán hoặc đã bán)
router.get("/listings/seller", authMiddleware, requireRole(['ev_owner']), getMyListingsHandler);//Lấy danh sách listing của người bán
router.get("/listings/:id", getListingByIdHandler);//Lấy một listing theo id
router.post("/listings/:id/purchase", authMiddleware, requireRole(['buyer']), buyListingHandler);//Người mua mua trực tiếp listing (giá cố định, không đấu giá)

// Auction routes
router.post("/listings/:id/bid", placeBidHandler); //Người mua đặt giá (bid) cho listing đấu giá
router.get("/listings/:id/bids", getBidsHandler); //Xem tất cả các bid hiện có cho listing đó
router.post("/listings/:id/close", closeAuctionHandler);//Kết thúc phiên đấu giá

// Orders
router.get("/orders", authMiddleware, getAllOrdersHandler);//Xem toàn bộ đơn hàng
router.get("/orders/seller", authMiddleware, requireRole(['ev_owner']), getSellerOrdersHandler);//Xem đơn hàng của seller
router.post("/orders/update", authMiddleware, requireRole(['ev_owner']), updateOrderStatusHandler);//Cập nhật trạng thái đơn hàng

export default router;
