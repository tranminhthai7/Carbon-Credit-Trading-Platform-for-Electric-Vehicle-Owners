import { Request, Response } from "express";
import * as orderService from "../services/orderService";

export async function getAllOrdersHandler(req: Request, res: Response) {
  const orders = await orderService.getAllOrders();
  res.json(orders);
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ error: "orderId and status required" });
    const result = await orderService.updateOrderStatus(orderId, status);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
}
