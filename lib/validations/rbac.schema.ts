import { z } from "zod";

// ============ PERMISSION VALIDATION ============

export const permissionSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  module: z.string().min(1, "Module is required"),
  sortOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

// ============ ROLE PERMISSION VALIDATION ============

export const rolePermissionSchema = z.object({
  permission: z.string().min(1, "Permission is required"),
  actions: z.array(z.string()).min(1, "At least one action is required"),
});

export type RolePermissionFormData = z.infer<typeof rolePermissionSchema>;

// ============ ADMIN ROLE VALIDATION ============

export const adminRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().optional(),
  permissions: z.array(rolePermissionSchema).optional(),
  isActive: z.boolean(),
});

export type AdminRoleFormData = z.infer<typeof adminRoleSchema>;

// ============ ADMIN USER VALIDATION ============

export const adminUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean(),
});

export type AdminUserFormData = z.infer<typeof adminUserFormSchema>;

// ============ LOGIN VALIDATION ============

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// ============ CHANGE PASSWORD VALIDATION ============

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
