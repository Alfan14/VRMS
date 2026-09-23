import { apiClient } from "@/lib/apiClient";

export const getVehicleUsages = () => apiClient.get("/vehicle-usages");
export const getVehicleUsage = ( id: string ) => apiClient.get( `/vehicle-usages/${id}` );
export const startVehicleUsage = ( data: unknown ) => apiClient.post("/vehicle-usages/start", data );
export const finishVehicleUsage = ( id: string, data: unknown ) => apiClient.post(`/vehicle-usages/${id}/finish`, data );
export const getReservations = () => apiClient.get("/reservations");
