//orderService.ts
import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";

const orderRepo = () => AppDataSource.getRepository(Order);

export async function createOrder(buyerId: string, sellerId: string, amount: number, pricePerCredit: number, listing: any) {
  const repo = orderRepo();
  const totalPrice = amount * pricePerCredit;
  const order = repo.create({ buyerId, sellerId, amount, totalPrice, listing, status: "PENDING" });
  return repo.save(order);
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
  return repo.save(order);
}
