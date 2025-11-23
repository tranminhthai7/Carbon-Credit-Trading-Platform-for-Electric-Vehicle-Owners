import { connectDatabase } from '../src/config/database';
import { Vehicle } from '../src/models/vehicle.model';

/**
 * Simple script to prune idempotency keys across all vehicles.
 * - Prunes older entries and keeps the latest N keys as defined by the controller config.
 */
async function runPrune() {
  await connectDatabase();
  console.log('Starting idempotency key pruning for vehicles...');
  try {
    const vehicles = await Vehicle.find({}).lean();
    for (const v of vehicles) {
      const vehicle = await Vehicle.findById(v._id);
      if (!vehicle) continue;
      const beforeImportCount = (vehicle.import_keys || []).length;
      const beforeCreditCount = (vehicle.credit_request_keys || []).length;
      // use same prune logic as controller (simplified)
      const TTL_DAYS = 90;
      const MAX_KEYS = 50;
      const cutoff = new Date(Date.now() - TTL_DAYS * 24 * 60 * 60 * 1000);
      vehicle.import_keys = (vehicle.import_keys || []).filter((e: any) => new Date(e.added_at || e.created_at) >= cutoff).slice(-MAX_KEYS);
      vehicle.credit_request_keys = (vehicle.credit_request_keys || []).filter((e: any) => new Date(e.added_at || e.created_at) >= cutoff).slice(-MAX_KEYS);
      await vehicle.save();
      if (vehicle.import_keys.length !== beforeImportCount || vehicle.credit_request_keys.length !== beforeCreditCount) {
        console.log(`Pruned vehicle ${vehicle._id}: import_keys ${beforeImportCount}->${vehicle.import_keys.length}, credit_request_keys ${beforeCreditCount}->${vehicle.credit_request_keys.length}`);
      }
    }
    console.log('Pruning complete');
    process.exit(0);
  } catch (err: any) {
    console.error('Prune failed:', err);
    process.exit(1);
  }
}

runPrune();
