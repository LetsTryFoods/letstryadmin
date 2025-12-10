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
import { Separator } from "@/components/ui/separator";
import { productSeoSchema, ProductSeoFormData } from "@/lib/validations/product-seo.schema";
import { ProductSeo, useCreateProductSeo, useUpdateProductSeo } from "@/lib/product-seo/useProductSeo";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Product } from "@/lib/products/useProducts";

interface ProductSeoFormProps {
  product: Product;
  existingSeo?: ProductSeo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductSeoForm({ product, existingSeo, onSuccess, onCancel }: ProductSeoFormProps) {
  const { createProductSeo, loading: createLoading } = useCreateProductSeo();
  const { updateProductSeo, loading: updateLoading } = useUpdateProductSeo();
  const isLoading = createLoading || updateLoading;

  // Generate default meta title from product name
  const defaultMetaTitle = `${product.name}${product.brand ? ` | ${product.brand}` : ""} - Buy Online`;
  
  // Strip HTML from description for default meta description
  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() || "";
  const defaultMetaDescription = stripHtml(product.description || "").substring(0, 155);

  const form = useForm<ProductSeoFormData>({
    resolver: zodResolver(productSeoSchema),
    defaultValues: {
      productId: product._id,
      productSlug: product.slug,
      productName: product.name,
      metaTitle: existingSeo?.metaTitle || defaultMetaTitle,
      metaDescription: existingSeo?.metaDescription || defaultMetaDescription,
      metaKeywords: existingSeo?.metaKeywords || "",
      canonicalUrl: existingSeo?.canonicalUrl || `https://letstryfoods.com/products/${product.slug}`,
      ogTitle: existingSeo?.ogTitle || "",
      ogDescription: existingSeo?.ogDescription || "",
      ogImage: existingSeo?.ogImage || product.images?.[0]?.url || "",
      isActive: existingSeo?.isActive ?? true,
    },
  });

  const metaTitleLength = form.watch("metaTitle")?.length || 0;
  const metaDescLength = form.watch("metaDescription")?.length || 0;

  const handleSubmit = async (data: ProductSeoFormData) => {
    try {
      const cleanedData = {
        ...data,
        metaKeywords: data.metaKeywords || undefined,
        canonicalUrl: data.canonicalUrl || undefined,
        ogTitle: data.ogTitle || undefined,
        ogDescription: data.ogDescription || undefined,
        ogImage: data.ogImage || undefined,
      };

      if (existingSeo?._id) {
        await updateProductSeo(existingSeo._id, cleanedData);
      } else {
        await createProductSeo(cleanedData);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save product SEO:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Product Info (Read-only) */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Product Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">{product.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Slug:</span>
              <p className="font-mono text-xs bg-background px-2 py-1 rounded">/{product.slug}</p>
            </div>
            {product.brand && (
              <div>
                <span className="text-muted-foreground">Brand:</span>
                <p className="font-medium">{product.brand}</p>
              </div>
            )}
          </div>
          {product.images?.[0]?.url && (
            <div className="mt-2">
              <img 
                src={product.images[0].url} 
                alt={product.name} 
                className="w-20 h-20 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Hidden fields */}
        <input type="hidden" {...form.register("productId")} />
        <input type="hidden" {...form.register("productSlug")} />
        <input type="hidden" {...form.register("productName")} />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="mt-0!">Active (Enable SEO for this product)</FormLabel>
            </FormItem>
          )}
        />

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
                  <Input {...field} placeholder="Product title for search engines" />
                </FormControl>
                <FormDescription>
                  Recommended: 50-60 characters. This appears as the clickable title in Google search results.
                </FormDescription>
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
                  <Textarea {...field} placeholder="Brief description of the product" rows={3} />
                </FormControl>
                <FormDescription>
                  Recommended: 140-155 characters. This appears below the title in Google search results.
                </FormDescription>
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
                  <Input {...field} placeholder="organic, healthy, snacks, buy online" />
                </FormControl>
                <FormDescription>Comma-separated keywords related to this product</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://letstryfoods.com/products/product-slug" />
                </FormControl>
                <FormDescription>The preferred URL for this product page</FormDescription>
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
            These settings control how your product looks when shared on WhatsApp, Facebook, LinkedIn, etc.
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
                  <Input {...field} placeholder="https://cdn.example.com/product-image.jpg" />
                </FormControl>
                <FormDescription>
                  Image shown when product is shared. Recommended size: 1200x630 pixels. 
                  Default: Product's first image.
                </FormDescription>
                {field.value && (
                  <div className="mt-2">
                    <img 
                      src={field.value} 
                      alt="Social preview" 
                      className="w-40 h-24 object-cover rounded border"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
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
            {isLoading ? "Saving..." : existingSeo ? "Update SEO" : "Save SEO"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
