// ============================================
// VERIFICATION TYPES - FIXED VERSION
// ============================================

// ✅ FIX: Match backend entity fields exactly
export interface Verification {
  id: string;
  user_id: string;          // ✅ Backend: user_id
  vehicle_id: string;       // ✅ Backend: vehicle_id
  co2_amount: number;       // ✅ Backend: co2_amount
  trips_count: number;      // ✅ Backend: trips_count
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  cva_id?: string;          // ✅ Backend: cva_id (nullable)
  notes?: string;           // ✅ Backend: notes (nullable)
  emission_data?: any;      // ✅ Backend: emission_data (JSON)
  trip_details?: any;       // ✅ Backend: trip_details (JSON)
  credits_issued?: number;  // ✅ Backend: credits_issued (nullable)
  created_at: string;       // ✅ Backend: created_at (timestamp)
  updated_at: string;       // ✅ Backend: updated_at (timestamp)
  reviewed_at?: string;     // ✅ Backend: reviewed_at (nullable timestamp)
}

// Alternative: Create a mapped version for frontend if you prefer camelCase
export interface VerificationFrontend {
  id: string;
  userId: string;
  vehicleId: string;
  co2Amount: number;
  tripsCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  cvaId?: string;
  notes?: string;
  emissionData?: any;
  tripDetails?: any;
  creditsIssued?: number;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
}

// Utility function to map backend to frontend
export const mapVerificationToFrontend = (backend: Verification): VerificationFrontend => ({
  id: backend.id,
  userId: backend.user_id,
  vehicleId: backend.vehicle_id,
  co2Amount: backend.co2_amount,
  tripsCount: backend.trips_count,
  status: backend.status,
  cvaId: backend.cva_id,
  notes: backend.notes,
  emissionData: backend.emission_data,
  tripDetails: backend.trip_details,
  creditsIssued: backend.credits_issued,
  createdAt: backend.created_at,
  updatedAt: backend.updated_at,
  reviewedAt: backend.reviewed_at,
});

// ============================================
// CERTIFICATE TYPES - ALREADY GOOD
// ============================================

export interface Certificate {
  id: string;
  userId: string;
  creditId: string;
  certificateNumber: string;
  issueDate: string;
  pdfUrl: string;
  // Backend compatibility fields
  user_id?: string;
  verification_id?: string;
  certificate_number?: string;
  certificate_url?: string;
  issued_at?: string;
  created_at?: string;
}

// ============================================
// OTHER TYPES (keep existing)
// ============================================

export enum UserRole {
  EV_OWNER = 'ev_owner',
  BUYER = 'buyer',
  VERIFIER = 'cva',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  batteryCapacity: number;
  registrationNumber: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  userId: string;
  startTime: string;
  endTime: string;
  distance: number;
  energyConsumed: number;
  carbonSaved: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CarbonCredit {
  id: string;
  walletId: string;
  tripId: string;
  amount: number;
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED';
  expiryDate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'EARN' | 'SPEND' | 'TRANSFER';
  amount: number;
  description: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  creditId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  // Additional fields from backend
  userId?: string;
  amount?: number;
  pricePerCredit?: number;
}

export interface Order {
  id: string;
  buyerId: string;
  listingId: string;
  quantity: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  // Additional fields from backend
  sellerId?: string;
  amount?: number;
  totalPrice?: number;
  listing?: Listing;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export interface PersonalStats {
  totalTrips: number;
  totalDistance: number;
  totalCarbonSaved: number;
  totalEarnings: number;
  verifiedTrips: number;
  pendingTrips: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalTrips: number;
  totalCarbonSaved: number;
  totalTransactions: number;
  totalRevenue: number;
  activeListings: number;
}