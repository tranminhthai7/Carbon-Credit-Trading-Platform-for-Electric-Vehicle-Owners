import dotenv from "dotenv";
dotenv.config();

const BASELINE_G_PER_KM = Number(process.env.EMISSION_BASELINE_G_PER_KM || 200);
const CREDIT_PER_TONNE = Number(process.env.CARBON_CREDIT_PER_TONNE || 1);

export function co2SavedKgFromDistanceKm(distanceKm: number, baselineGPerKm = BASELINE_G_PER_KM): number {
  // baseline (ICE) - EV assumed near zero (or you can provide EV emissions)
  const savedGrams = baselineGPerKm * distanceKm;
  return savedGrams / 1000; // return kg
}

export function kgToCredits(kg: number): number {
  // 1 credit = 1 tonne = 1000 kg
  const tonnes = kg / 1000;
  return tonnes * CREDIT_PER_TONNE;
}
