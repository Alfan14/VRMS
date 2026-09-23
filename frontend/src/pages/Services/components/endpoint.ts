import { apiClient } from "@/lib/apiClient";

export const getServices = () =>  apiClient.get("/services");
export const getService = (  id: string ) => apiClient.get(`/services/${id}`);
export const createService = ( data: unknown ) => apiClient.post("/services",data);

export const startService = ( id: string ) => apiClient.post(`/services/${id}/start`, {});
export const completeService = ( id: string, data: unknown) => apiClient.post(`/services/${id}/complete`, data);

/**
 * Master Vehicle
 */
export const getVehicles = () => apiClient.get("/vehicles");