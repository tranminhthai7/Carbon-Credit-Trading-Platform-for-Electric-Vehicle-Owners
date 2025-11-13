import { apiClient } from './api';

export interface DateRange {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface RevenuePoint {
  date: string;
  amount: number;
}

export interface RevenueResponse {
  currency: string;
  total: number;
  points: RevenuePoint[];
}

export interface UserBehaviorPoint {
  date: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
}

export interface UserBehaviorResponse {
  points: UserBehaviorPoint[];
  totals: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
  };
}

export interface CarbonStatsResponse {
  totalCredits: number;
  minted: number;
  sold: number;
  expired: number;
}

function withRange(path: string, range?: DateRange): string {
  if (!range?.startDate && !range?.endDate) return path;
  const params = new URLSearchParams();
  if (range.startDate) params.set('startDate', range.startDate);
  if (range.endDate) params.set('endDate', range.endDate);
  return `${path}?${params.toString()}`;
}

export const analyticsService = {
  getRevenue: async (range?: DateRange): Promise<RevenueResponse> => {
    const res = await apiClient.get<RevenueResponse>(withRange('/api/analytics/revenue', range));
    return res.data;
  },
  getUsers: async (range?: DateRange): Promise<UserBehaviorResponse> => {
    const res = await apiClient.get<UserBehaviorResponse>(withRange('/api/analytics/users', range));
    return res.data;
  },
  getCarbon: async (range?: DateRange): Promise<CarbonStatsResponse> => {
    const res = await apiClient.get<CarbonStatsResponse>(withRange('/api/analytics/carbon', range));
    return res.data;
  },
};


