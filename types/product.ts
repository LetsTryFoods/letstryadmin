export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  sku: string;
  gtin?: string;
  mpn?: string;
  images: ProductImage[];
  thumbnailUrl?: string;
  price: number;
  mrp: number;
  discountPercent: number;
  currency: string;
  length: number;
  height: number;
  breadth: number;
  weight: number;
  weightUnit: string;
  packageSize: string;
  ingredients: string;
  allergens?: string;
  shelfLife: string;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  availabilityStatus: string | boolean; // Based on usage in page.tsx
  stockQuantity: number;
  rating?: number;
  ratingCount: number;
  keywords: string[];
  tags: string[];
  discountSource: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductColumn {
  key: string;
  label: string;
}
