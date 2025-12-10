import { z } from "zod";

export const productSeoSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productSlug: z.string().min(1, "Product slug is required"),
  productName: z.string().min(1, "Product name is required"),
  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(70, "Meta title should be under 70 characters"),
  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(160, "Meta description should be under 160 characters"),
  metaKeywords: z.string().optional(),
  canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type ProductSeoFormData = z.infer<typeof productSeoSchema>;
