//orderService.ts
import { AppDataSource } from "../db";
import { publishEvent } from "../config/mq";
import { Order } from "../entities/Order";
import { Listing } from "../entities/Listing";

const orderRepo = () => AppDataSource.getRepository('Order' as any);

export async function createOrder(buyerId: string, sellerId: string, amount: number, pricePerCredit: number, listingId: string, manager?: any) {
  const repo = manager ? manager.getRepository('Order' as any) : orderRepo();
  const totalPrice = amount * pricePerCredit;
  const order = repo.create({ buyerId, sellerId, amount, totalPrice, listingId, status: "PENDING" });
  const saved = await repo.save(order);
  // Publish order.created event to MQ (best-effort)
  try {
    await publishEvent('orders', { event: 'order.created', data: saved });
  } catch (err) {
    console.error('Could not publish order.created event', err);
  }
  return saved;
}

export async function getAllOrders() {
  const repo = orderRepo();
  return repo.find();
}

export async function updateOrderStatus(orderId: string, status: "COMPLETED" | "CANCELLED") {
  const repo = orderRepo();
  const order = await repo.findOneBy({ id: orderId });
  if (!order) throw new Error("Order not found");
  order.status = status;
  const saved = await repo.save(order);
  try {
    await publishEvent('orders', { event: 'order.updated', data: saved });
  } catch (err) {
    console.error('Could not publish order.updated event', err);
  }
  return saved;
}
