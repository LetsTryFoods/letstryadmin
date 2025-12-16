"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  useCreateAdminRole,
  useUpdateAdminRole,
  useActivePermissions,
  AdminRole,
  Permission,
} from "@/lib/rbac/useRbac";
import { adminRoleSchema, AdminRoleFormData } from "@/lib/validations/rbac.schema";
import { Loader2, Check } from "lucide-react";
import { toast } from "react-hot-toast";

// Permission actions
const PERMISSION_ACTIONS = [
  { value: "view", label: "View" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "manage", label: "Full Access" },
];

interface RoleFormProps {
  initialData?: AdminRole | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PermissionSelection {
  [permissionId: string]: string[];
}

export function RoleForm({ initialData, onSuccess, onCancel }: RoleFormProps) {
  const isEditing = !!initialData;
  const { data: permissionsData, loading: permissionsLoading } = useActivePermissions();
  const [createRole, { loading: creating }] = useCreateAdminRole();
  const [updateRole, { loading: updating }] = useUpdateAdminRole();

  const permissions: Permission[] = permissionsData?.activePermissions || [];
  const isLoading = creating || updating;

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  // State for permission selections
  const [permissionSelections, setPermissionSelections] = useState<PermissionSelection>({});

  // Initialize permission selections from initial data
  useEffect(() => {
    if (initialData?.permissions) {
      const selections: PermissionSelection = {};
      initialData.permissions.forEach((rp) => {
        if (rp.permission?._id) {
          selections[rp.permission._id] = rp.actions;
        }
      });
      setPermissionSelections(selections);
    }
  }, [initialData]);

  const form = useForm<AdminRoleFormData>({
    resolver: zodResolver(adminRoleSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  // Generate slug from name
  const name = form.watch("name");
  useEffect(() => {
    if (!isEditing && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  }, [name, isEditing, form]);

  const handlePermissionToggle = (permissionId: string, action: string) => {
    setPermissionSelections((prev) => {
      const current = prev[permissionId] || [];
      
      // If selecting "manage", remove all others and just set manage
      if (action === "manage") {
        if (current.includes("manage")) {
          return { ...prev, [permissionId]: [] };
        }
        return { ...prev, [permissionId]: ["manage"] };
      }
      
      // If already has manage and selecting something else, remove manage first
      let newActions = current.filter((a) => a !== "manage");
      
      if (newActions.includes(action)) {
        newActions = newActions.filter((a) => a !== action);
      } else {
        newActions.push(action);
      }
      
      return { ...prev, [permissionId]: newActions };
    });
  };

  const handleSelectAll = (permissionId: string) => {
    setPermissionSelections((prev) => ({
      ...prev,
      [permissionId]: ["manage"],
    }));
  };

  const handleDeselectAll = (permissionId: string) => {
    setPermissionSelections((prev) => ({
      ...prev,
      [permissionId]: [],
    }));
  };

  const onSubmit = async (data: AdminRoleFormData) => {
    try {
      // Build permissions array
      const permissionsInput = Object.entries(permissionSelections)
        .filter(([_, actions]) => actions.length > 0)
        .map(([permissionId, actions]) => ({
          permission: permissionId,
          actions,
        }));

      const input = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        permissions: permissionsInput,
        isActive: data.isActive,
      };

      if (isEditing) {
        await updateRole({
          variables: {
            id: initialData._id,
            input,
          },
        });
        toast.success("Role updated successfully");
      } else {
        await createRole({
          variables: { input },
        });
        toast.success("Role created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save role");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Manager" disabled={initialData?.isSystem} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., manager"
                    disabled={initialData?.isSystem}
                  />
                </FormControl>
                <FormDescription>Unique identifier (auto-generated)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Brief description of this role" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={initialData?.isSystem}
                />
              </FormControl>
              <FormLabel className="!mt-0">Active</FormLabel>
            </FormItem>
          )}
        />

        <Separator />

        {/* Permissions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Permissions</h3>
          {permissionsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} className="border rounded-lg p-4">
                  <h4 className="font-medium text-green-700 mb-3 capitalize">
                    {module} Module
                  </h4>
                  <div className="space-y-3">
                    {modulePermissions.map((permission) => (
                      <div
                        key={permission._id}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{permission.name}</div>
                          {permission.description && (
                            <div className="text-xs text-gray-500">{permission.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {PERMISSION_ACTIONS.map((action) => (
                            <label
                              key={action.value}
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              <Checkbox
                                checked={
                                  permissionSelections[permission._id]?.includes(action.value) ||
                                  (action.value !== "manage" &&
                                    permissionSelections[permission._id]?.includes("manage"))
                                }
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission._id, action.value)
                                }
                                disabled={
                                  action.value !== "manage" &&
                                  permissionSelections[permission._id]?.includes("manage")
                                }
                              />
                              <span className="text-xs">{action.label}</span>
                            </label>
                          ))}
                          <div className="flex gap-1 ml-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleSelectAll(permission._id)}
                            >
                              All
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleDeselectAll(permission._id)}
                            >
                              None
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? "Update" : "Create"} Role
          </Button>
        </div>
      </form>
    </Form>
  );
}
