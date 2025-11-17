"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes\index.ts
const express_1 = require("express");
const listingController_1 = require("../controllers/listingController");
const orderController_1 = require("../controllers/orderController");
const bidController_1 = require("../controllers/bidController");
const router = (0, express_1.Router)();
// Listing routes
router.post("/listings", listingController_1.createListingHandler); //Tạo mới một listing (đăng bán tín chỉ carbon)
router.get("/listings", listingController_1.getAllListingsHandler); //Lấy danh sách tất cả các listing hiện có (chưa bán hoặc đã bán)
router.post("/listings/:id/purchase", listingController_1.buyListingHandler); //Người mua mua trực tiếp listing (giá cố định, không đấu giá)
// Auction routes
router.post("/listings/:id/bid", bidController_1.placeBidHandler); //Người mua đặt giá (bid) cho listing đấu giá
router.get("/listings/:id/bids", bidController_1.getBidsHandler); //Xem tất cả các bid hiện có cho listing đó
router.post("/listings/:id/close", bidController_1.closeAuctionHandler); //Kết thúc phiên đấu giá
// Orders
router.get("/orders", orderController_1.getAllOrdersHandler); //Xem toàn bộ đơn hàng
router.post("/orders/update", orderController_1.updateOrderStatusHandler); //Cập nhật trạng thái đơn hàng
exports.default = router;
