export const ROLES = {
  ADMIN: "ADMIN",
  KEPALA_OPERASIONAL: "KEPALA_OPERASIONAL",
  MANAGER: "MANAGER",
} as const;

export type UserRole =
  typeof ROLES[keyof typeof ROLES];

export const ROLE_OPTIONS = [
  {
    label: "Admin",
    value: ROLES.ADMIN,
  },
  {
    label: "Kepala Operasional",
    value: ROLES.KEPALA_OPERASIONAL,
  },
  {
    label: "Manager",
    value: ROLES.MANAGER,
  },
];

export const ADMIN_ROLES: UserRole[] = [
  ROLES.ADMIN,
  ROLES.KEPALA_OPERASIONAL,
  ROLES.MANAGER,
];

export const ALL_ROLES: UserRole[] =
  Object.values(ROLES);