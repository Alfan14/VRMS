import { UserRole, ADMIN_ROLES, ALL_ROLES } from "./constants/roles";

export type { UserRole };
export { ADMIN_ROLES, ALL_ROLES };

export interface StoredUser {
  id: string;
  nama: string;
  username: string;
  email: string;
  role: UserRole;
  wilayah_id?: string;
  kantor_id?: string;
}

export const getStoredUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem("user");

    return raw ? (JSON.parse(raw) as StoredUser): null;
  } catch {
    return null;
  }
};

export const getUserRole = (): UserRole | null => getStoredUser()?.role ?? null;

export const hasRole = ( allowedRoles: UserRole[]): boolean => {
  const role = getUserRole();

  return role !== null && allowedRoles.includes(role);
};

export const isAuthenticated = (): boolean => !!localStorage.getItem("token");