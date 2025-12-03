import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  gtin: z.string().optional(),
  mpn: z.string().optional(),
  images: z.array(z.object({
    file: z.any(),
    alt: z.string().min(1, "Alt text is required"),
    preview: z.string()
  })).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
  price: z.coerce.number().min(0, "Price must be positive"),
  mrp: z.coerce.number().min(0, "MRP must be positive"),
  discountPercent: z.coerce.number().min(0).max(100),
  currency: z.string().default("INR"),
  length: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  breadth: z.coerce.number().min(0),
  weight: z.coerce.number().min(0),
  weightUnit: z.string().default("g"),
  packageSize: z.string().min(1, "Package size is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  allergens: z.string().optional(),
  shelfLife: z.string().min(1, "Shelf life is required"),
  isVegetarian: z.boolean().default(true),
  isGlutenFree: z.boolean().default(false),
  availabilityStatus: z.boolean().default(true),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  rating: z.coerce.number().min(0).max(5).optional(),
  ratingCount: z.coerce.number().int().min(0).default(0),
  keywords: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  discountSource: z.string().default("product"),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
