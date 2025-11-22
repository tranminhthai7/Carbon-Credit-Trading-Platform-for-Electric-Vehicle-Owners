import { apiClient } from './api';
import { Listing, Order } from '../types';

export const marketplaceService = {
  // Get all active listings
  getListings: async (): Promise<Listing[]> => {
    const response = await apiClient.get<Listing[]>('/api/listings');
    return response.data;
  },

  // Get listing by ID
  getListingById: async (listingId: string): Promise<Listing> => {
    const response = await apiClient.get<Listing>(`/api/listings/${listingId}`);
    return response.data;
  },

  // Get user's listings (for sellers)
  getMyListings: async (): Promise<Listing[]> => {
    const response = await apiClient.get<Listing[]>('/api/listings/seller');
    return response.data;
  },

  // Create a new listing
  createListing: async (listingData: Partial<Listing>): Promise<Listing> => {
    const response = await apiClient.post<Listing>('/api/listings', listingData);
    return response.data;
  },

  // Update listing
  updateListing: async (listingId: string, listingData: Partial<Listing>): Promise<Listing> => {
    const response = await apiClient.put<Listing>(`/api/listings/${listingId}`, listingData);
    return response.data;
  },

  // Cancel listing
  cancelListing: async (listingId: string): Promise<void> => {
    await apiClient.delete(`/api/listings/${listingId}`);
  },

  // Purchase a listing (create order)
  purchaseListing: async (listingId: string, buyerId: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/api/listings/${listingId}/purchase`, {
      buyerId,
    });
    return response.data;
  },

  // Get user's orders (for buyers)
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/listings/orders');
    return response.data;
  },
};
