"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrdersByUser = getOrdersByUser;
exports.getOrdersBySeller = getOrdersBySeller;
exports.updateOrderStatus = updateOrderStatus;
//orderService.ts
const db_1 = require("../db");
const mq_1 = require("../config/mq");
const orderRepo = () => db_1.AppDataSource.getRepository('Order');
async function createOrder(buyerId, sellerId, amount, pricePerCredit, listingId, manager) {
    const repo = manager ? manager.getRepository('Order') : orderRepo();
    const totalPrice = amount * pricePerCredit;
    const order = repo.create({ buyerId, sellerId, amount, totalPrice, listingId, status: "PENDING" });
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
async function getOrdersByUser(userId) {
    const repo = orderRepo();
    const orders = await repo.find({ where: { buyerId: userId } });
    // Map totalPrice to totalAmount for frontend compatibility
    return orders.map(order => ({
        ...order,
        totalAmount: order.totalPrice,
        quantity: order.amount, // also map amount to quantity
    }));
}
async function getOrdersBySeller(userId) {
    const repo = orderRepo();
    const orders = await repo.find({ where: { sellerId: userId } });
    // Map totalPrice to totalAmount for frontend compatibility
    return orders.map(order => ({
        ...order,
        totalAmount: order.totalPrice,
        quantity: order.amount, // also map amount to quantity
    }));
}
async function updateOrderStatus(orderId, status, userId) {
    const repo = orderRepo();
    const order = await repo.findOneBy({ id: orderId });
    if (!order)
        throw new Error("Order not found");
    if (userId && order.sellerId !== userId)
        throw new Error("Unauthorized: Only seller can update order status");
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
