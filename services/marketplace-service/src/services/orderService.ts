//orderService.ts
import { AppDataSource } from "../data-source";
import { publishEvent } from "../config/mq";
import { Order } from "../entities/Order";

const orderRepo = () => AppDataSource.getRepository(Order);

export async function createOrder(buyerId: string, sellerId: string, amount: number, pricePerCredit: number, listing: any) {
  const repo = orderRepo();
  const totalPrice = amount * pricePerCredit;
  const order = repo.create({ buyerId, sellerId, amount, totalPrice, listing, status: "PENDING" });
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
  return repo.find({ relations: ["listing"] });
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
