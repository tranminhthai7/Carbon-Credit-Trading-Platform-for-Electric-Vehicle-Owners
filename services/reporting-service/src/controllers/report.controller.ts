import { Request, Response } from "express";

export const getPersonalReport = (req: Request, res: Response) => {
  const { userId } = req.params;
  res.json({ message: `Báo cáo cá nhân của user ${userId}` });
};

export const getCo2Savings = (req: Request, res: Response) => {
  const { userId } = req.params;
  res.json({ userId, co2Saved: 123.45, unit: "kg" });
};

export const getRevenueReport = (req: Request, res: Response) => {
  const { userId } = req.params;
  res.json({ userId, revenue: 1500, currency: "USD" });
};

export const getPlatformAnalytics = (req: Request, res: Response) => {
  res.json({
    totalTransactions: 500,
    totalRevenue: 250000,
    totalCO2Saved: 10230,
  });
};
