// User types
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

// Auth types
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

// EV and Trip types
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

// Wallet and Credit types
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

// Marketplace types
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
}

export interface Order {
  id: string;
  buyerId: string;
  listingId: string;
  quantity: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

// Payment types
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

// Verification types
export interface Verification {
  id: string;
  tripId: string;
  verifierId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  verifiedAt?: string;
  createdAt: string;
}

// Certificate types
export interface Certificate {
  id: string;
  userId: string;
  creditId: string;
  certificateNumber: string;
  issueDate: string;
  pdfUrl: string;
}

// Analytics types
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
