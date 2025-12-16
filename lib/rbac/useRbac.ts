import { useMutation, useQuery } from '@apollo/client/react'
import {
  GET_PERMISSIONS,
  GET_ACTIVE_PERMISSIONS,
  GET_PERMISSION_MODULES,
  GET_ADMIN_ROLES,
  GET_ACTIVE_ADMIN_ROLES,
  GET_ADMIN_ROLE,
  GET_ADMIN_USERS,
  GET_ADMIN_USER,
  GET_ADMIN_ME,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  TOGGLE_PERMISSION_ACTIVE,
  CREATE_ADMIN_ROLE,
  UPDATE_ADMIN_ROLE,
  DELETE_ADMIN_ROLE,
  TOGGLE_ADMIN_ROLE_ACTIVE,
  CREATE_ADMIN_USER,
  UPDATE_ADMIN_USER,
  DELETE_ADMIN_USER,
  TOGGLE_ADMIN_USER_ACTIVE,
  ADMIN_USER_LOGIN,
  CHANGE_ADMIN_PASSWORD,
  ADMIN_LOGOUT,
} from "@/lib/graphql/rbac";

// ============ TYPES ============

export interface Permission {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  module: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolePermission {
  permission: Permission;
  actions: string[];
}

export interface AdminRole {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: RolePermission[];
  isSystem: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPermission {
  slug: string;
  name: string;
  module: string;
  actions: string[];
}

export interface AdminMe {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  roleName: string;
  roleSlug: string;
  permissions: AdminPermission[];
  isActive: boolean;
}

export interface AdminAuthResponse {
  accessToken: string;
  _id: string;
  name: string;
  email: string;
  roleName: string;
  roleSlug: string;
  permissions: AdminPermission[];
}

export interface PaginationMeta {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============ QUERY RESPONSE TYPES ============

export interface PermissionsResponse {
  permissions: Permission[];
}

export interface ActivePermissionsResponse {
  activePermissions: Permission[];
}

export interface PermissionModulesResponse {
  permissionModules: string[];
}

export interface AdminRolesResponse {
  adminRoles: {
    items: AdminRole[];
    meta: PaginationMeta;
  };
}

export interface ActiveAdminRolesResponse {
  activeAdminRoles: AdminRole[];
}

export interface AdminRoleResponse {
  adminRole: AdminRole;
}

export interface AdminUsersResponse {
  adminUsers: {
    items: AdminUser[];
    meta: PaginationMeta;
  };
}

export interface AdminUserResponse {
  adminUser: AdminUser;
}

export interface AdminMeResponse {
  adminMe: AdminMe;
}

// ============ PERMISSION HOOKS ============

export function usePermissions() {
  return useQuery<PermissionsResponse>(GET_PERMISSIONS, {
    fetchPolicy: "cache-and-network",
  });
}

export function useActivePermissions() {
  return useQuery<ActivePermissionsResponse>(GET_ACTIVE_PERMISSIONS, {
    fetchPolicy: "cache-and-network",
  });
}

export function usePermissionModules() {
  return useQuery<PermissionModulesResponse>(GET_PERMISSION_MODULES, {
    fetchPolicy: "cache-and-network",
  });
}

export function useCreatePermission() {
  return useMutation(CREATE_PERMISSION, {
    refetchQueries: ["GetPermissions", "GetActivePermissions"],
  });
}

export function useUpdatePermission() {
  return useMutation(UPDATE_PERMISSION, {
    refetchQueries: ["GetPermissions", "GetActivePermissions"],
  });
}

export function useDeletePermission() {
  return useMutation(DELETE_PERMISSION, {
    refetchQueries: ["GetPermissions", "GetActivePermissions"],
  });
}

export function useTogglePermissionActive() {
  return useMutation(TOGGLE_PERMISSION_ACTIVE, {
    refetchQueries: ["GetPermissions", "GetActivePermissions"],
  });
}

// ============ ADMIN ROLE HOOKS ============

export function useAdminRoles(page: number = 1, limit: number = 10) {
  return useQuery<AdminRolesResponse>(GET_ADMIN_ROLES, {
    variables: { page, limit },
    fetchPolicy: "cache-and-network",
  });
}

export function useActiveAdminRoles() {
  return useQuery<ActiveAdminRolesResponse>(GET_ACTIVE_ADMIN_ROLES, {
    fetchPolicy: "cache-and-network",
  });
}

export function useAdminRole(id: string) {
  return useQuery<AdminRoleResponse>(GET_ADMIN_ROLE, {
    variables: { id },
    skip: !id,
  });
}

export function useCreateAdminRole() {
  return useMutation(CREATE_ADMIN_ROLE, {
    refetchQueries: ["GetAdminRoles", "GetActiveAdminRoles"],
  });
}

export function useUpdateAdminRole() {
  return useMutation(UPDATE_ADMIN_ROLE, {
    refetchQueries: ["GetAdminRoles", "GetActiveAdminRoles"],
  });
}

export function useDeleteAdminRole() {
  return useMutation(DELETE_ADMIN_ROLE, {
    refetchQueries: ["GetAdminRoles", "GetActiveAdminRoles"],
  });
}

export function useToggleAdminRoleActive() {
  return useMutation(TOGGLE_ADMIN_ROLE_ACTIVE, {
    refetchQueries: ["GetAdminRoles", "GetActiveAdminRoles"],
  });
}

// ============ ADMIN USER HOOKS ============

export function useAdminUsers(page: number = 1, limit: number = 10) {
  return useQuery<AdminUsersResponse>(GET_ADMIN_USERS, {
    variables: { page, limit },
    fetchPolicy: "cache-and-network",
  });
}

export function useAdminUser(id: string) {
  return useQuery<AdminUserResponse>(GET_ADMIN_USER, {
    variables: { id },
    skip: !id,
  });
}

export function useAdminMe() {
  return useQuery<AdminMeResponse>(GET_ADMIN_ME, {
    fetchPolicy: "cache-and-network",
  });
}

export function useCreateAdminUser() {
  return useMutation(CREATE_ADMIN_USER, {
    refetchQueries: ["GetAdminUsers"],
  });
}

export function useUpdateAdminUser() {
  return useMutation(UPDATE_ADMIN_USER, {
    refetchQueries: ["GetAdminUsers"],
  });
}

export function useDeleteAdminUser() {
  return useMutation(DELETE_ADMIN_USER, {
    refetchQueries: ["GetAdminUsers"],
  });
}

export function useToggleAdminUserActive() {
  return useMutation(TOGGLE_ADMIN_USER_ACTIVE, {
    refetchQueries: ["GetAdminUsers"],
  });
}

// ============ AUTH HOOKS ============

export interface AdminUserLoginResponse {
  adminUserLogin: AdminAuthResponse;
}

export function useAdminLogin() {
  return useMutation<AdminUserLoginResponse>(ADMIN_USER_LOGIN);
}

export function useChangeAdminPassword() {
  return useMutation(CHANGE_ADMIN_PASSWORD);
}

export function useAdminLogout() {
  return useMutation(ADMIN_LOGOUT);
}
