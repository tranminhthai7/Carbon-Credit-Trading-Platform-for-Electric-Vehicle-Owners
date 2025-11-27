import { apiClient } from './api';
import { Listing, Order } from '../types';

// Helper to map backend listing to frontend Listing interface
function mapBackendListingToFrontend(b: any): Listing {
  // backend fields: id, userId, amount, pricePerCredit, status, createdAt
  // frontend expects: id, sellerId, creditId, quantity, pricePerUnit, totalPrice, status, createdAt, updatedAt
  const quantity = Number(b.amount ?? b.quantity ?? 0);
  const pricePerUnit = Number(b.pricePerCredit ?? b.pricePerUnit ?? 0);
  const statusMap = (s: string | undefined) => {
    // Map backend OPEN -> ACTIVE to match frontend expectations
    if (!s) return 'ACTIVE';
    if (s === 'OPEN') return 'ACTIVE';
    return s as any;
  };

  return {
    id: b.id,
    sellerId: b.userId ?? b.sellerId,
    creditId: b.creditId ?? '',
    quantity,
    pricePerUnit,
    totalPrice: Number(b.totalPrice ?? quantity * pricePerUnit),
    status: statusMap(b.status),
    type: b.type ?? 'FIXED_PRICE',
    createdAt: b.createdAt ?? b.created_at ?? '',
    updatedAt: b.updatedAt ?? b.updated_at ?? b.createdAt ?? '',
  } as Listing;
}

export const marketplaceService = {
  // Get all active listings
  getListings: async (): Promise<Listing[]> => {
    const response = await apiClient.get<any[]>('/api/listings');
    return response.data.map(mapBackendListingToFrontend);
  },

  // Get listing by ID
  getListingById: async (listingId: string): Promise<Listing> => {
    const response = await apiClient.get<any>(`/api/listings/${listingId}`);
    return mapBackendListingToFrontend(response.data);
  },

  // Get user's listings (for sellers)
  getMyListings: async (): Promise<Listing[]> => {
    const response = await apiClient.get<any[]>('/api/listings/seller');
    return response.data.map(mapBackendListingToFrontend);
  },

  // Create a new listing
  createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
    // Convert frontend payload to backend shape expected by server
    const raw = listingData as any;
    const payload: any = {
      amount: raw.quantity ?? raw.amount,
      pricePerCredit: raw.pricePerUnit ?? raw.pricePerCredit,
      type: raw.type,
    };
    const response = await apiClient.post<any>('/api/listings', payload);
    return mapBackendListingToFrontend(response.data);
  },

  // Update a listing
  updateListing: async (listingId: string, listingData: Partial<Listing>): Promise<Listing> => {
    // Merge frontend update to backend expected keys
    const raw = listingData as any;
    const payload: any = {};
    if (raw.pricePerUnit !== undefined) payload.pricePerCredit = raw.pricePerUnit;
    if (raw.quantity !== undefined) payload.amount = raw.quantity;
    const response = await apiClient.put<any>(`/api/listings/${listingId}`, payload);
    return mapBackendListingToFrontend(response.data);
  },

  // Cancel listing
  cancelListing: async (listingId: string): Promise<void> => {
    await apiClient.delete(`/api/listings/${listingId}`);
  },

  // Purchase a listing (create order)
  purchaseListing: async (listingId: string, buyerId: string, quantity: number): Promise<Order> => {
    const response = await apiClient.post<Order>(`/api/listings/${listingId}/purchase`, {
      buyerId,
      quantity,
    });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${orderId}`);
    return response.data;
  },

  // Get user's orders (for buyers)
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders');
    return response.data;
  },

  // Get seller's orders (for sellers)
  getSellerOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders/seller');
    return response.data;
  },

  // Update order status (for sellers)
  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await apiClient.post<Order>('/api/orders/update', {
      orderId,
      status,
    });
    return response.data;
  },

  // Pay for an order
  payOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post<Order>('/api/orders/pay', { orderId });
    return response.data;
  },
};
