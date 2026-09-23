import { apiClient } from "@/lib/apiClient";

/**
 * Drivers
 */
export const getDrivers = () => apiClient.get("/drivers");
export const getDriver = ( id: string ) => apiClient.get(`/drivers/${id}`);
export const createDriver = (data: unknown) => apiClient.post("/drivers", data);
export const updateDriver = ( id: string, data: unknown ) => apiClient.put(`/drivers/${id}`,data);
export const deleteDriver = ( id: string ) => apiClient.delete( `/drivers/${id}`);
/**
 * Kantor
 */
export const getKantor = () =>  apiClient.get("/kantor");