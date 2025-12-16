"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  useCreatePermission,
  useUpdatePermission,
  usePermissionModules,
  Permission,
} from "@/lib/rbac/useRbac";
import { permissionSchema, PermissionFormData } from "@/lib/validations/rbac.schema";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

// Predefined modules
const DEFAULT_MODULES = [
  "core",
  "catalog",
  "content",
  "settings",
  "seo",
  "marketing",
  "users",
  "orders",
  "analytics",
  "admin",
];

interface PermissionFormProps {
  initialData?: Permission | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PermissionForm({ initialData, onSuccess, onCancel }: PermissionFormProps) {
  const isEditing = !!initialData;
  const { data: modulesData } = usePermissionModules();
  const [createPermission, { loading: creating }] = useCreatePermission();
  const [updatePermission, { loading: updating }] = useUpdatePermission();

  const existingModules: string[] = modulesData?.permissionModules || [];
  const allModules = [...new Set([...DEFAULT_MODULES, ...existingModules])].sort();
  const isLoading = creating || updating;

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      slug: initialData?.slug || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      module: initialData?.module || "",
      sortOrder: initialData?.sortOrder || 0,
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

  const onSubmit = async (data: PermissionFormData) => {
    try {
      const input = {
        slug: data.slug,
        name: data.name,
        description: data.description || undefined,
        module: data.module,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      };

      if (isEditing) {
        await updatePermission({
          variables: {
            id: initialData._id,
            input,
          },
        });
        toast.success("Permission updated successfully");
      } else {
        await createPermission({
          variables: { input },
        });
        toast.success("Permission created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save permission");
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
                <Input {...field} placeholder="e.g., Products Management" />
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
                <Input {...field} placeholder="e.g., products" />
              </FormControl>
              <FormDescription>
                URL path identifier (lowercase, hyphens only). Should match the dashboard route.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allModules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Group permissions by module for organization</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Brief description" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={0} />
              </FormControl>
              <FormDescription>Lower numbers appear first</FormDescription>
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
            {isEditing ? "Update" : "Create"} Permission
          </Button>
        </div>
      </form>
    </Form>
  );
}
