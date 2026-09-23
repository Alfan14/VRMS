import { apiClient } from '@/lib/apiClient';
import { UserRole } from '@/lib/constants/roles';

export interface UserPayload {
  username: string;
  role: UserRole;
  password?: string;
  pin?: string;
  is_active?: boolean;
}

export const getUsers = () =>
  apiClient.get('/users');

export const getUserById = (id: string) =>
  apiClient.get(`/users/${id}`);

export const createUser = (data: UserPayload) =>
  apiClient.post('/users', data);

export const updateUser = (id: string, data: Partial<UserPayload>) =>
  apiClient.put(`/users/${id}`, data);

export const deleteUser = (id: string) =>
  apiClient.delete(`/users/${id}`);
