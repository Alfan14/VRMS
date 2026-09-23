import { apiClient } from "@/lib/apiClient";

export const getFuelRecords = () => apiClient.get("/fuel-records");
export const getFuelRecord = ( id: string ) => apiClient.get(`/fuel-records/${id}`);
export const createFuelRecord = ( data: unknown ) => apiClient.post( "/fuel-records", data );

/**
 * Source Data
 */
export const getVehicleUsages = () => apiClient.get("/vehicle-usages");