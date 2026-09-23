import { apiClient } from '@/lib/apiClient';

export const getDailySalesReport = (date: string) =>
  apiClient.get(`/reports/sales/daily?date=${encodeURIComponent(date)}`);

export const getMonthlySalesReport = (year: number, month: number) =>
  apiClient.get(`/reports/sales/monthly?year=${year}&month=${month}`);
