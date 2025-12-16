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
import { Separator } from "@/components/ui/separator";
import { seoContentSchema, SeoContentFormData } from "@/lib/validations/seo.schema";
import { SeoContent, useActiveSeoPages, ActiveSeoPagesResponse, SeoPage } from "@/lib/seo/useSeo";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface SeoFormProps {
  initialData?: SeoContent | null;
  onSubmit: (data: SeoContentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SeoForm({ initialData, onSubmit, onCancel, isLoading }: SeoFormProps) {
  // Fetch dynamic page options from API
  const { data: pagesData, loading: pagesLoading } = useActiveSeoPages();
  const pageOptions: SeoPage[] = (pagesData as ActiveSeoPagesResponse)?.activeSeoPages || [];

  const form = useForm<SeoContentFormData>({
    resolver: zodResolver(seoContentSchema),
    defaultValues: {
      pageName: initialData?.pageName || "",
      pageSlug: initialData?.pageSlug || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      canonicalUrl: initialData?.canonicalUrl || "",
      ogTitle: initialData?.ogTitle || "",
      ogDescription: initialData?.ogDescription || "",
      ogImage: initialData?.ogImage || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const metaTitleLength = form.watch("metaTitle")?.length || 0;
  const metaDescLength = form.watch("metaDescription")?.length || 0;

  const handleSubmit = async (data: SeoContentFormData) => {
    // Clean empty strings to undefined
    const cleanedData = {
      ...data,
      metaKeywords: data.metaKeywords || undefined,
      canonicalUrl: data.canonicalUrl || undefined,
      ogTitle: data.ogTitle || undefined,
      ogDescription: data.ogDescription || undefined,
      ogImage: data.ogImage || undefined,
    };
    await onSubmit(cleanedData as SeoContentFormData);
  };

  const handlePageSelect = (slug: string) => {
    const page = pageOptions.find((p) => p.slug === slug);
    if (page) {
      form.setValue("pageSlug", slug);
      form.setValue("pageName", page.label);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pageSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Slug *</FormLabel>
                  <Select onValueChange={handlePageSelect} defaultValue={field.value} disabled={pagesLoading}>
                    <FormControl>
                      <SelectTrigger>
                        {pagesLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading pages...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select a page" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pageOptions.map((option) => (
                        <SelectItem key={option.slug} value={option.slug}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    {...field}
                    placeholder="Or enter custom slug"
                    className="mt-2"
                  />
                  <FormDescription>URL identifier (lowercase, hyphens only)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="pageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Home Page" />
                  </FormControl>
                  <FormDescription>Display name in admin</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

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
        </div>

        <Separator />

        {/* Meta Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-600">Meta Tags (Search Engines)</h3>
          
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>Meta Title *</span>
                  <Badge variant={metaTitleLength > 60 ? "destructive" : "default"}>
                    {metaTitleLength}/70
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Page title for search engines" />
                </FormControl>
                <FormDescription>Recommended: 50-60 characters. This appears as the clickable title in Google search results.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>Meta Description *</span>
                  <Badge variant={metaDescLength > 155 ? "destructive" : "default"}>
                    {metaDescLength}/160
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Brief description of the page content" rows={3} />
                </FormControl>
                <FormDescription>Recommended: 140-155 characters. This appears below the title in Google search results.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Keywords (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="organic food, healthy snacks, natural products" />
                </FormControl>
                <FormDescription>Comma-separated keywords related to this page</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical URL (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://letstryfoods.com/page" />
                </FormControl>
                <FormDescription>The preferred URL for this page (to avoid duplicate content issues)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Open Graph - Social Sharing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-600">Social Media Sharing</h3>
          <p className="text-sm text-muted-foreground">
            These settings control how your page looks when shared on WhatsApp, Facebook, LinkedIn, etc.
          </p>
          
          <FormField
            control={form.control}
            name="ogTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Title (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Title when shared on social media" />
                </FormControl>
                <FormDescription>Leave empty to use Meta Title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Description when shared on social media" rows={2} />
                </FormControl>
                <FormDescription>Leave empty to use Meta Description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Image URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://cdn.example.com/image.jpg" />
                </FormControl>
                <FormDescription>Image shown when page is shared. Recommended size: 1200x630 pixels</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t sticky bottom-0 bg-background py-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update SEO" : "Create SEO"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
