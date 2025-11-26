//walletController.ts
import { Request, Response } from 'express';
import * as walletService from '../services/walletService';

export async function createWalletHandler(req: Request, res: Response) {
  try {
    // Try to parse the body or heal it if needed
    const tryParseBody = (r: Request) => {
      if (r.body && Object.keys(r.body).length) return r.body;
      const raw = (r as any).rawBody || '';
      if (!raw) return {};
      try { return JSON.parse(raw); } catch (e) {
        // Attempt to wrap keys in quotes (from {userId:1} to {"userId":1})
        try {
          const normalized = raw.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
          return JSON.parse(normalized);
        } catch { return {}; }
      }
    };
    const { userId } = tryParseBody(req);
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
    let wallet = await walletService.getWalletByUserId(userId);
    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await walletService.createWallet(userId);
    }

    // Calculate totals from transactions
    const incomingTotal = wallet.incoming?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
    const outgoingTotal = wallet.outgoing?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;

    // Format response to match frontend expectations
    const walletResponse = {
      id: wallet.id,
      userId: wallet.userId,
      balance: Number(wallet.balance),
      totalEarned: incomingTotal,
      totalSpent: outgoingTotal,
      createdAt: wallet.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Wallet entity doesn't have updatedAt
      incoming: wallet.incoming?.map(tx => ({
        id: tx.id,
        amount: Number(tx.amount),
        type: tx.type,
        createdAt: tx.createdAt?.toISOString(),
      })) || [],
      outgoing: wallet.outgoing?.map(tx => ({
        id: tx.id,
        amount: Number(tx.amount),
        type: tx.type,
        createdAt: tx.createdAt?.toISOString(),
      })) || [],
    };

    res.json(walletResponse);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}

export async function mintHandler(req: Request, res: Response) {
  try {
    // Try to get parsed body; if json parser failed, try to buffer raw body and parse manually
    let parsed = req.body;
    if (!parsed || Object.keys(parsed).length === 0) {
      let raw = (req as any).rawBody;
      if (!raw) {
        raw = '';
        req.on('data', (chunk) => { raw += chunk; });
        await new Promise<void>((resolve) => req.on('end', () => resolve()));
      }
      console.log('[MINT HANDLER] Raw body:', raw);
      try {
        parsed = JSON.parse(raw || '{}');
      } catch (e: any) {
        console.warn('[MINT HANDLER] Failed to parse raw body', e?.message || e);
        // Try to normalize keys (accept {userId:.., amount:..})
        try {
          const normalized = raw.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
          parsed = JSON.parse(normalized);
        } catch (ee: any) {
          console.warn('[MINT HANDLER] Failed to normalize raw body', ee?.message || ee);
          parsed = {};
        }
      }
    }
    const { userId, amount } = parsed;
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

export async function issueCreditsHandler(req: Request, res: Response) {
  try {
    const { user_id, amount } = req.body;
    if (!user_id || typeof amount !== 'number') return res.status(400).json({ error: 'user_id and numeric amount required' });
    const result = await walletService.mintCredits(user_id, amount);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Error' });
  }
}