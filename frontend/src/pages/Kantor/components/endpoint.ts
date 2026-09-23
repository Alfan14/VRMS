import { apiClient } from "@/lib/apiClient";

export const getDataKantor = (endpoint: string) => apiClient.get(endpoint);
export const postDataKantor = (endpoint: string, data: unknown) => apiClient.post(endpoint, data);
export const putDataKantor = (endpoint: string, data: unknown) => apiClient.put(endpoint, data);
export const deleteDataKantor = (endpoint: string) => apiClient.delete(endpoint);