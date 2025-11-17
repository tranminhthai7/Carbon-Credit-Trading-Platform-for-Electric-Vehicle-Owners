"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
//orderService.ts
const data_source_1 = require("../data-source");
const mq_1 = require("../config/mq");
const Order_1 = require("../entities/Order");
const orderRepo = () => data_source_1.AppDataSource.getRepository(Order_1.Order);
async function createOrder(buyerId, sellerId, amount, pricePerCredit, listing) {
    const repo = orderRepo();
    const totalPrice = amount * pricePerCredit;
    const order = repo.create({ buyerId, sellerId, amount, totalPrice, listing, status: "PENDING" });
    const saved = await repo.save(order);
    // Publish order.created event to MQ (best-effort)
    try {
        await (0, mq_1.publishEvent)('orders', { event: 'order.created', data: saved });
    }
    catch (err) {
        console.error('Could not publish order.created event', err);
    }
    return saved;
}
async function getAllOrders() {
    const repo = orderRepo();
    return repo.find({ relations: ["listing"] });
}
async function updateOrderStatus(orderId, status) {
    const repo = orderRepo();
    const order = await repo.findOneBy({ id: orderId });
    if (!order)
        throw new Error("Order not found");
    order.status = status;
    const saved = await repo.save(order);
    try {
        await (0, mq_1.publishEvent)('orders', { event: 'order.updated', data: saved });
    }
    catch (err) {
        console.error('Could not publish order.updated event', err);
    }
    return saved;
}
