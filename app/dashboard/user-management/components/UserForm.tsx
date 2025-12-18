"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateAdminUser,
  useUpdateAdminUser,
  useActiveAdminRoles,
  AdminUser,
  AdminRole,
} from "@/lib/rbac/useRbac";
import { adminUserFormSchema, AdminUserFormData } from "@/lib/validations/rbac.schema";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserFormProps {
  initialData?: AdminUser | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
  const isEditing = !!initialData;
  const { data: rolesData, loading: rolesLoading } = useActiveAdminRoles();
  const [createUser, { loading: creating }] = useCreateAdminUser();
  const [updateUser, { loading: updating }] = useUpdateAdminUser();

  const roles: AdminRole[] = rolesData?.activeAdminRoles || [];
  const isLoading = creating || updating;

  const form = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email?.toLowerCase() || "",
      password: "",
      phone: initialData?.phone || "",
      avatar: initialData?.avatar || "",
      role: initialData?.role?._id || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: AdminUserFormData) => {
    try {
      if (isEditing) {
        // Remove empty password for update
        const updateData: any = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        // Clean empty strings
        if (!updateData.phone) delete updateData.phone;
        if (!updateData.avatar) delete updateData.avatar;

        await updateUser({
          variables: {
            id: initialData._id,
            input: updateData,
          },
        });
        toast.success("User updated successfully");
      } else {
        await createUser({
          variables: {
            input: {
              name: data.name,
              email: data.email.toLowerCase(),
              password: data.password,
              phone: data.phone || undefined,
              avatar: data.avatar || undefined,
              role: data.role,
              isActive: data.isActive,
            },
          },
        });
        toast.success("User created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save user");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? "New Password" : "Password *"}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={isEditing ? "Leave blank to keep current" : "Min 6 characters"}
                />
              </FormControl>
              {isEditing && (
                <FormDescription>Leave blank to keep current password</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Phone number (optional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {rolesLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading roles...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a role" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                      {role.isSystem && " (System)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">Active</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? "Update" : "Create"} User
          </Button>
        </div>
      </form>
    </Form>
  );
}
