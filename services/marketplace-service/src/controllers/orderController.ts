import { Request, Response } from "express";
import * as orderService from "../services/orderService";

export async function getAllOrdersHandler(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const orders = await orderService.getOrdersByUser(userId);
  res.json(orders);
}

export async function getSellerOrdersHandler(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const orders = await orderService.getOrdersBySeller(userId);
  res.json(orders);
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
  try {
    const { orderId, status } = req.body;
    const userId = (req as any).user?.id;
    if (!orderId || !status) return res.status(400).json({ error: "orderId and status required" });
    const validStatuses = ["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const result = await orderService.updateOrderStatus(orderId, status as any, userId);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}

export async function getOrderByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    if (!id) return res.status(400).json({ error: "Order id required" });
    const order = await orderService.getOrderById(id, userId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}

export async function payOrderHandler(req: Request, res: Response) {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user?.id;
    if (!orderId) return res.status(400).json({ error: "orderId required" });
    const result = await orderService.payOrder(orderId, userId);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}
