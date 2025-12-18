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
import { seoPageSchema, SeoPageFormData } from "@/lib/validations/seo.schema";
import { SeoPage } from "@/lib/seo/useSeo";
import { Loader2 } from "lucide-react";

interface SeoPageFormProps {
  initialData?: SeoPage | null;
  onSubmit: (data: SeoPageFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SeoPageForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: SeoPageFormProps) {
  const form = useForm<SeoPageFormData>({
    resolver: zodResolver(seoPageSchema),
    defaultValues: {
      slug: initialData?.slug || "",
      label: initialData?.label || "",
      description: initialData?.description || "",
      sortOrder: initialData?.sortOrder || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: SeoPageFormData) => {
    const cleanedData = {
      ...data,
      description: data.description || undefined,
    };
    await onSubmit(cleanedData as SeoPageFormData);
  };

  // Auto-generate slug from label
  const handleLabelChange = (value: string) => {
    form.setValue("label", value);
    if (!initialData) {
      // Only auto-generate slug for new entries
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Label *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Home Page, About Us"
                  onChange={(e) => handleLabelChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Display name shown in dropdowns and admin panel
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Slug *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., home, about-us" />
              </FormControl>
              <FormDescription>
                URL identifier (lowercase, hyphens only). This will be used to
                match SEO entries.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Brief description of this page type"
                  rows={2}
                />
              </FormControl>
              <FormDescription>
                Optional description for admin reference
              </FormDescription>
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
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </FormControl>
              <FormDescription>
                Lower numbers appear first in dropdowns
              </FormDescription>
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
                />
              </FormControl>
              <FormLabel className="!mt-0">Active</FormLabel>
              <FormDescription className="!mt-0 ml-2">
                (Only active pages appear in SEO form dropdown)
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Page" : "Add Page"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
