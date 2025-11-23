import { Schema, model, Document } from "mongoose";

export interface IPersonalReport extends Document {
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  co2SavedKg: number;     // tổng kg CO2 giảm
  carbonCredits: number;  // số tín chỉ (số thực)
  revenueVND: number;
  createdAt: Date;
}

const PersonalReportSchema = new Schema<IPersonalReport>({
  userId: { type: String, required: true, index: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  co2SavedKg: { type: Number, default: 0 },
  carbonCredits: { type: Number, default: 0 },
  revenueVND: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const PersonalReport = model<IPersonalReport>("PersonalReport", PersonalReportSchema, "personal_reports");
