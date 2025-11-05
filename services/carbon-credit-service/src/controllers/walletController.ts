//walletController.ts
import { Request, Response } from 'express';
import * as walletService from '../services/walletService';

export async function createWalletHandler(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const wallet = await walletService.createWallet(userId);
    res.json(wallet);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}

export async function getWalletHandler(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const wallet = await walletService.getWalletByUserId(userId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}

export async function mintHandler(req: Request, res: Response) {
  try {
    const { userId, amount } = req.body;
    if (!userId || typeof amount !== 'number') return res.status(400).json({ error: 'userId and numeric amount required' });
    const result = await walletService.mintCredits(userId, amount);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Error' });
  }
}

export async function transferHandler(req: Request, res: Response) {
  try {
    const { fromUserId, toUserId, amount } = req.body;
    if (!fromUserId || !toUserId || typeof amount !== 'number') return res.status(400).json({ error: 'fromUserId, toUserId and numeric amount required' });

    const result = await walletService.transferCredits(fromUserId, toUserId, amount);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Error' });
  }
}