//walletService.ts
import { AppDataSource } from '../data-source';
import { Wallet } from '../entities/Wallet';
import { Transaction } from '../entities/Transaction';

const walletRepo = () => AppDataSource.getRepository(Wallet);
const txRepo = () => AppDataSource.getRepository(Transaction);

export async function createWallet(userId: string) {
  const repo = walletRepo();
  let existing = await repo.findOne({
    where: { userId },
    select: ['id', 'userId', 'balance'] // select only these fields
  });
  if (existing) return existing;
  const wallet = repo.create({ userId, balance: 0 });
  return repo.save(wallet);
}

export async function getWalletByUserId(userId: string) {
  const repo = walletRepo();
  return repo.findOne({
    where: { userId },
    relations: ['incoming', 'outgoing'],
  });
}

export async function mintCredits(userId: string, amount: number) {
  const repo = walletRepo();
  const txRepository = txRepo();

  let wallet = await repo.findOneBy({ userId });
  if (!wallet) {
    wallet = await createWallet(userId);
  }

  wallet.balance = Number(wallet.balance) + Number(amount);
  await repo.save(wallet);

  const tx = txRepository.create({
    fromWallet: null,
    toWallet: wallet,
    amount,
    type: 'MINT',
  });
  await txRepository.save(tx);

  return { wallet, tx };
}

export async function transferCredits(fromUserId: string, toUserId: string, amount: number) {
  const repo = walletRepo();
  const txRepository = txRepo();

  if (amount <= 0) throw new Error('Amount must be > 0');

  const from = await repo.findOneBy({ userId: fromUserId });
  let to = await repo.findOneBy({ userId: toUserId });

  if (!from) throw new Error('Sender wallet not found');
  if (!to) {
    // Create recipient wallet if it doesn't exist
    to = await createWallet(toUserId);
  }

  if (from.balance < amount) throw new Error('Insufficient balance');

  // transaction: update balances
  from.balance = Number(from.balance) - Number(amount);
  to.balance = Number(to.balance) + Number(amount);

  await repo.save(from);
  await repo.save(to);

  const tx = txRepository.create({
    fromWallet: from,
    toWallet: to,
    amount,
    type: 'TRANSFER',
  });
  await txRepository.save(tx);

  return { from, to, tx };
}