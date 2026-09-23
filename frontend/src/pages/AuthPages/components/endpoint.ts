import { apiClient } from "@/lib/apiClient";
import { UserRole } from "@/lib/auth";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      nama: string;
      username: string;
      email: string;
      role: UserRole;
      wilayah_id?: string;
      kantor_id?: string;
    };
  };
}

export const login = ( username: string, password: string): Promise<LoginResponse> => 
  apiClient.post("/auth/login", {
    username,
    password,
  });

export const logout = () => apiClient.post("/auth/logout");
export const getMe = () => apiClient.get("/auth/me");