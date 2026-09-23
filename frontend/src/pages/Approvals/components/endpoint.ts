import { apiClient } from "@/lib/apiClient";

/**
 * Pending
 */

export const getPendingLevel1 = () => apiClient.get("/approvals/pending-level-1");
export const getPendingLevel2 = () => apiClient.get("/approvals/pending-level-2");

/**
 * Approve
 */
export const approveLevel1 = ( id: string, data: unknown ) => apiClient.post(`/approvals/${id}/approve`,data);
export const approveLevel2 = ( id: string, data: unknown ) => apiClient.post(`/approvals/${id}/approve`,data);

/**
 * Reject
 */
export const rejectLevel1 = ( id: string, data: unknown ) => apiClient.post(`/approvals/${id}/reject`,data);
export const rejectLevel2 = ( id: string, data: unknown ) => apiClient.post(`/approvals/${id}/reject`,data);

/**
 * Reservation Detail
 */
export const getReservationDetail = ( id: string ) => apiClient.get(`/reservations/${id}`);