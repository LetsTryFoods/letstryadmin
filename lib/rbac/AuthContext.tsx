"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAdminMe, AdminMe, AdminPermission } from "@/lib/rbac/useRbac";

interface AuthContextType {
  user: AdminMe | null;
  loading: boolean;
  permissions: AdminPermission[];
  hasPermission: (slug: string, action?: string) => boolean;
  isSuperAdmin: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, loading, refetch } = useAdminMe();
  const [user, setUser] = useState<AdminMe | null>(null);

  useEffect(() => {
    if (data?.adminMe) {
      setUser(data.adminMe);
    }
  }, [data]);

  const permissions = user?.permissions || [];
  const isSuperAdmin = user?.roleSlug === "super-admin";

  const hasPermission = (slug: string, action: string = "view"): boolean => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;

    const permission = permissions.find((p) => p.slug === slug);
    if (!permission) return false;

    // Check if user has the specific action or manage (full access)
    return permission.actions.includes(action) || permission.actions.includes("manage");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        permissions,
        hasPermission,
        isSuperAdmin,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to check if user can access a specific page
export function useCanAccess(slug: string, action: string = "view") {
  const { hasPermission, loading } = useAuth();
  return {
    canAccess: hasPermission(slug, action),
    loading,
  };
}

// Hook to get all allowed actions for a permission
export function usePermissionActions(slug: string) {
  const { permissions, isSuperAdmin, loading } = useAuth();

  if (isSuperAdmin) {
    return {
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canManage: true,
      loading,
    };
  }

  const permission = permissions.find((p) => p.slug === slug);
  const actions = permission?.actions || [];
  const hasManage = actions.includes("manage");

  return {
    canView: hasManage || actions.includes("view"),
    canCreate: hasManage || actions.includes("create"),
    canUpdate: hasManage || actions.includes("update"),
    canDelete: hasManage || actions.includes("delete"),
    canManage: hasManage,
    loading,
  };
}
