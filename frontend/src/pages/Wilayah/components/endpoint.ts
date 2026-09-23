import { apiClient } from "@/lib/apiClient";

export const getDataWilayah = (endpoint: string) => apiClient.get(endpoint);
export const postDataWilayah = (endpoint: string, data: unknown) =>apiClient.post(endpoint, data);
export const putDataWilayah = (endpoint: string, data: unknown) =>apiClient.put(endpoint, data);
export const deleteDataWilayah = (endpoint: string) => apiClient.delete(endpoint);