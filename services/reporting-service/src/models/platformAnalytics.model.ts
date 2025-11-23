import { Schema, model, Document } from "mongoose";

export interface IPlatformAnalytics extends Document {
  periodStart: Date;
  periodEnd: Date;
  totalCreditsListed: number;
  totalCreditsSold: number;
  totalRevenueVND: number;
  transactionsCount: number;
  createdAt: Date;
}

const PlatformAnalyticsSchema = new Schema<IPlatformAnalytics>({
  periodStart: Date,
  periodEnd: Date,
  totalCreditsListed: Number,
  totalCreditsSold: Number,
  totalRevenueVND: Number,
  transactionsCount: Number,
  createdAt: { type: Date, default: Date.now }
});

export const PlatformAnalytics = model<IPlatformAnalytics>("PlatformAnalytics", PlatformAnalyticsSchema, "platform_analytics");
