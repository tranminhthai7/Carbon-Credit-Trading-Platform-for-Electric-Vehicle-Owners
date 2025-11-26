import { Request, Response } from "express";
import mongoose from "mongoose";
import { PersonalReport } from "../models/personalReport.model";
import { PlatformAnalytics } from "../models/platformAnalytics.model";
import { RevenueReport } from "../models/revenueReport.model";
import { co2SavedKgFromDistanceKm, kgToCredits } from "../utils/co2.util";
import { evMongoose } from "../config/database";

// GET /reports/personal/:userId
export const getPersonalReport = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    let reports = await PersonalReport.find({ userId }).sort({ periodStart: -1 }).limit(12);
    console.log(`Found ${reports.length} reports for user ${userId}`);
    
    // If no reports, aggregate from EV data
    if (reports.length === 0 && evMongoose) {
      console.log('No reports, aggregating from EV data');
      const vehicleSchema = new mongoose.Schema({
        user_id: String,
        total_distance_km: Number,
        total_co2_saved_kg: Number,
        trips: [{
          distance_km: Number,
          co2_saved_kg: Number,
          start_time: Date,
          end_time: Date
        }]
      }, { collection: 'vehicles' });
      const Vehicle = evMongoose.model('Vehicle', vehicleSchema);
      
      const vehicle = await Vehicle.findOne({ user_id: userId });
      console.log('Vehicle found:', !!vehicle);
      if (vehicle) {
        console.log('Vehicle data:', vehicle.total_distance_km, vehicle.total_co2_saved_kg);
        const totalKm = vehicle.total_distance_km || 0;
        const co2Kg = vehicle.total_co2_saved_kg || 0;
        const credits = kgToCredits(co2Kg);
        // Assume price per credit, e.g., 100 VND
        const revenue = credits * 100;
        
        const report = await PersonalReport.create({
          userId,
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          periodEnd: new Date(),
          co2SavedKg: co2Kg,
          carbonCredits: credits,
          revenueVND: revenue
        });
        console.log('Created report:', report);
        reports = [report];
      }
    }
    
    res.json({ ok: true, data: reports });
  } catch (err) {
    console.error('Error in getPersonalReport:', err);
    res.status(500).json({ ok: false, error: err });
  }
};

// GET /reports/co2-savings/:userId?from=&to=
export const getCo2Savings = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { from, to } = req.query;
  try {
    // đơn giản: lấy các personal reports trong khoảng
    const q: any = { userId };
    if (from || to) q.periodStart = {};
    if (from) q.periodStart.$gte = new Date(String(from));
    if (to) q.periodStart.$lte = new Date(String(to));
    const reports = await PersonalReport.find(q);
    const totalKg = reports.reduce((s, r) => s + r.co2SavedKg, 0);
    const totalCredits = reports.reduce((s, r) => s + r.carbonCredits, 0);
    res.json({ ok: true, totalKg, totalCredits, reports });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

// GET /reports/revenue/:userId
export const getRevenueReport = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const revenues = await RevenueReport.find({ userId }).sort({ periodStart: -1 }).limit(12);
    const totalRevenue = revenues.reduce((s, r) => s + (r.revenueVND || 0), 0);
    res.json({ ok: true, totalRevenue, items: revenues });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

// GET /reports/platform  (Admin)
export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await PlatformAnalytics.find().sort({ periodStart: -1 }).limit(12);
    res.json({ ok: true, data: analytics });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};

// Helper: tạo PersonalReport bằng dữ liệu hành trình (giả lập)
export const createPersonalReportFromTrip = async (req: Request, res: Response) => {
  try {
    // body: { userId, trips: [{distanceKm}], periodStart, periodEnd, pricePerCreditVND }
    const { userId, trips, periodStart, periodEnd, pricePerCreditVND } = req.body;
    const totalKm = (trips || []).reduce((s:any, t:any) => s + (t.distanceKm || 0), 0);
    const co2Kg = co2SavedKgFromDistanceKm(totalKm);
    const credits = kgToCredits(co2Kg);
    const revenue = (credits * (pricePerCreditVND || 0));
    const report = await PersonalReport.create({
      userId,
      periodStart: periodStart ? new Date(periodStart) : new Date(),
      periodEnd: periodEnd ? new Date(periodEnd) : new Date(),
      co2SavedKg: co2Kg,
      carbonCredits: credits,
      revenueVND: revenue
    });
    res.json({ ok: true, data: report });
  } catch (err) {
    res.status(500).json({ ok: false, error: err });
  }
};
