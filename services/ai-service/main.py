from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

app = FastAPI()

class PriceSuggestionRequest(BaseModel):
    amount: int
    region: str = "global"

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/suggest-price")
async def suggest_price(request: PriceSuggestionRequest):
    # Simple heuristic: suggest price based on amount
    # In real AI, this would use ML model with market data
    base_price = 5.0  # base price per credit
    if request.amount > 100:
        base_price *= 0.9  # discount for bulk
    elif request.amount < 10:
        base_price *= 1.1  # premium for small

    # Simulate market adjustment
    market_factor = 1.0 + (hash(request.region) % 20 - 10) / 100  # random -10% to +10%

    suggested_price = base_price * market_factor

    return {
        "suggested_price_per_credit": round(suggested_price, 2),
        "estimated_total": round(suggested_price * request.amount, 2),
        "confidence": 0.8  # mock confidence
    }