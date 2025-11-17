"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCO2 = calculateCO2;
/**
 * POST /calculate/co2
 * body: { distance: number, startEmission?: number, targetEmission?: number }
 *
 * default startEmission = 120 g/km, targetEmission = 20 g/km
 * result: grams, tons, credits (1 credit = 1 ton)
 */
async function calculateCO2(req, res) {
    try {
        const { distance, startEmission = 120, targetEmission = 20 } = req.body;
        if (typeof distance !== 'number' || distance < 0) {
            return res.status(400).json({ error: 'distance must be positive number' });
        }
        const delta = (startEmission - targetEmission);
        const grams = delta * distance; // grams
        const tons = grams / 1000000; // grams -> metric tons
        const credits = tons; // 1 credit = 1 ton CO2
        res.json({
            grams,
            tons,
            credits
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal error' });
    }
}
