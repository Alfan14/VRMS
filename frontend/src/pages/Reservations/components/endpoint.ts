import { apiClient } from "@/lib/apiClient";

export const getReservations = () => apiClient.get("/reservations");

export const getReservation = ( id: string) => apiClient.get(`/reservations/${id}`);
export const createReservation = ( data: unknown ) => apiClient.post("/reservations",data);

export const updateReservation = ( id: string, data: unknown ) => apiClient.put(`/reservations/${id}`, data);
export const deleteReservation = ( id: string ) => apiClient.delete(`/reservations/${id}`);

/**
 * Dropdown Sources
 */
export const getVehicles = () => apiClient.get("/vehicles");
export const getDrivers = () => apiClient.get("/drivers");