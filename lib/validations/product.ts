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
  price: z.coerce.number().min(0, "Price cannot be negative").positive("Price must be greater than 0"),
  mrp: z.coerce.number().min(0, "MRP cannot be negative").positive("MRP must be greater than 0"),
  discountPercent: z.coerce.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%"),
  currency: z.string().default("INR"),
  length: z.coerce.number().min(0, "Length cannot be negative").positive("Length must be greater than 0"),
  height: z.coerce.number().min(0, "Height cannot be negative").positive("Height must be greater than 0"),
  breadth: z.coerce.number().min(0, "Breadth cannot be negative").positive("Breadth must be greater than 0"),
  weight: z.coerce.number().min(0, "Weight cannot be negative").positive("Weight must be greater than 0"),
  weightUnit: z.string().default("g"),
  packageSize: z.string().min(1, "Package size is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  allergens: z.string().optional(),
  shelfLife: z.string().min(1, "Shelf life is required"),
  isVegetarian: z.boolean().default(true),
  isGlutenFree: z.boolean().default(false),
  availabilityStatus: z.boolean().default(true),
  stockQuantity: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  rating: z.coerce.number().min(0, "Rating cannot be negative").max(5, "Rating cannot exceed 5").optional(),
  ratingCount: z.coerce.number().int("Rating count must be a whole number").min(0, "Rating count cannot be negative").default(0),
  keywords: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  discountSource: z.string().default("product"),
  favourite: z.boolean().optional(),
}).refine((data) => data.mrp >= data.price, {
  message: "MRP must be greater than or equal to Price",
  path: ["mrp"],
})

export type ProductFormValues = z.infer<typeof productFormSchema>
