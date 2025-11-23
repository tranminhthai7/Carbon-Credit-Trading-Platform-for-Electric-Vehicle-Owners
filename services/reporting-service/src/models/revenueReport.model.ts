import { Schema, model, Document } from "mongoose";

export interface IRevenueReport extends Document {
  userId?: string; // nếu null => platform level
  periodStart: Date;
  periodEnd: Date;
  revenueVND: number;
  feesVND?: number;
  createdAt: Date;
}

const RevenueReportSchema = new Schema<IRevenueReport>({
  userId: { type: String, required: false, index: true },
  periodStart: Date,
  periodEnd: Date,
  revenueVND: Number,
  feesVND: Number,
  createdAt: { type: Date, default: Date.now }
});

export const RevenueReport = model<IRevenueReport>("RevenueReport", RevenueReportSchema, "revenue_reports");
