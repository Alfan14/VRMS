import { z } from "zod";
import { ROLES } from "../constants/roles";

export const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  pin: z.string().optional().or(z.literal("")),
  role: z.enum([ROLES.superadmin, ROLES.admin, ROLES.manager, ROLES.kasir]),
  is_active: z.boolean().default(true),
});

export type UserFormValues = z.infer<typeof userSchema>;
