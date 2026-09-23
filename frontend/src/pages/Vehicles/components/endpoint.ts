import { apiClient } from "@/lib/apiClient";

export const getVehicles = () => apiClient.get("/vehicles");
export const getVehicle = (id: string) => apiClient.get(`/vehicles/${id}`);
export const createVehicle = (data: unknown) => apiClient.post("/vehicles", data);

export const updateVehicle = (id: string, data: unknown) => apiClient.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id: string) => apiClient.delete(`/vehicles/${id}`);