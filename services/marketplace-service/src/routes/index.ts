//routes\index.ts
import { Router } from "express";
import { createListingHandler, getAllListingsHandler, getListingByIdHandler, getMyListingsHandler, buyListingHandler, updateListingHandler, cancelListingHandler } from "../controllers/listingController";
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { getAllOrdersHandler, getSellerOrdersHandler, updateOrderStatusHandler, payOrderHandler, getOrderByIdHandler } from "../controllers/orderController";
import { placeBidHandler, getBidsHandler, closeAuctionHandler } from "../controllers/bidController";

const listingRouter = Router();

// Listing routes
listingRouter.post("/", authMiddleware, requireRole(['ev_owner']), createListingHandler);//Tạo mới một listing (đăng bán tín chỉ carbon)
listingRouter.get("/", getAllListingsHandler);//Lấy danh sách tất cả các listing hiện có (chưa bán hoặc đã bán)
listingRouter.get("/seller", authMiddleware, requireRole(['ev_owner']), getMyListingsHandler);//Lấy danh sách listing của người bán
listingRouter.get("/:id", getListingByIdHandler);//Lấy một listing theo id
listingRouter.put("/:id", authMiddleware, requireRole(['ev_owner']), updateListingHandler);//Cập nhật listing (chỉ price)
listingRouter.delete("/:id", authMiddleware, requireRole(['ev_owner']), cancelListingHandler);//Hủy listing
listingRouter.post("/:id/purchase", authMiddleware, requireRole(['buyer']), buyListingHandler);//Người mua mua trực tiếp listing (giá cố định, không đấu giá)

// Auction routes (on listings)
listingRouter.post("/:id/bid", placeBidHandler); //Người mua đặt giá (bid) cho listing đấu giá
listingRouter.get("/:id/bids", getBidsHandler); //Xem tất cả các bid hiện có cho listing đó
listingRouter.post("/:id/close", closeAuctionHandler);//Kết thúc phiên đấu giá

const orderRouter = Router();

// Orders
orderRouter.get("/", authMiddleware, getAllOrdersHandler);//Xem toàn bộ đơn hàng
orderRouter.get("/seller", authMiddleware, requireRole(['ev_owner']), getSellerOrdersHandler);//Xem đơn hàng của seller
orderRouter.get("/:id", authMiddleware, getOrderByIdHandler);//Xem chi tiết đơn hàng theo id
orderRouter.post("/update", authMiddleware, requireRole(['ev_owner']), updateOrderStatusHandler);//Cập nhật trạng thái đơn hàng
orderRouter.post("/pay", authMiddleware, requireRole(['buyer']), payOrderHandler);//Thanh toán đơn hàng

const bidRouter = Router();

// Bids (if any direct bid routes, but currently on listings)

export { listingRouter, orderRouter, bidRouter };
