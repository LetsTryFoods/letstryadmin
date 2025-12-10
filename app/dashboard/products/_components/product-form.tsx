'use client'

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/custom/image-upload"
import { WysiwygEditor } from "@/components/custom/wysiwyg-editor"
import { TagInput } from "@/components/custom/tag-input"
import { productFormSchema, ProductFormValues } from "@/lib/validations/product"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/lib/categories/useCategories"
import { Product } from "@/types/product"

interface ProductFormProps {
  onClose: () => void
  initialData?: Product | null
  createProduct: (data: any) => Promise<any>
  updateProduct: (data: any) => Promise<any>
}

export function ProductForm({ onClose, initialData, createProduct, updateProduct }: ProductFormProps) {
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File | null; alt: string; preview: string; finalUrl?: string }>>(
    initialData?.images?.map(img => ({
      file: null,
      alt: img.alt,
      preview: img.url || "",
      finalUrl: img.url
    })) || []
  )

  const { data: categoriesData, loading: categoriesLoading } = useCategories({ page: 1, limit: 100 }, false)
  const categories = (categoriesData as any)?.categories?.items || []

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema as any),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      brand: initialData?.brand || "",
      sku: initialData?.sku || "",
      gtin: initialData?.gtin || "",
      mpn: initialData?.mpn || "",
      images: initialData?.images ? initialData.images.map(img => ({ file: null, alt: img.alt, preview: img.url })) : [{ file: null, alt: "", preview: "" }],
      price: initialData?.price || 0,
      mrp: initialData?.mrp || 0,
      discountPercent: initialData?.discountPercent || 0,
      currency: initialData?.currency || "INR",
      length: initialData?.length || 0,
      height: initialData?.height || 0,
      breadth: initialData?.breadth || 0,
      weight: initialData?.weight || 0,
      weightUnit: initialData?.weightUnit || "g",
      packageSize: initialData?.packageSize || "",
      ingredients: initialData?.ingredients || "",
      allergens: initialData?.allergens || "",
      shelfLife: initialData?.shelfLife || "",
      isVegetarian: initialData?.isVegetarian ?? true,
      isGlutenFree: initialData?.isGlutenFree ?? false,
      availabilityStatus: typeof initialData?.availabilityStatus === 'string' 
        ? initialData.availabilityStatus === 'in_stock' 
        : (initialData?.availabilityStatus as boolean ?? true),
      stockQuantity: initialData?.stockQuantity || 0,
      rating: initialData?.rating || undefined,
      ratingCount: initialData?.ratingCount || 0,
      keywords: initialData?.keywords || [],
      tags: initialData?.tags || [],
      discountSource: initialData?.discountSource || "product",
      favourite: initialData?.favourite ?? false,
    },
  })

  const handleImagesChange = useCallback((images: Array<{ file: File | null; alt: string; preview: string; finalUrl?: string }>) => {
    setUploadedImages(images)
  }, [])

  useEffect(() => {
    form.setValue('images', uploadedImages.map(img => ({
      file: img.file,
      alt: img.alt,
      preview: img.preview
    })) as any, { shouldValidate: false, shouldDirty: true })
  }, [uploadedImages, form])

  const onSubmit = async (data: ProductFormValues) => {
    console.log("onSubmit called with data:", data)
    try {
      console.log('Form submitted with data:', data)
      
      const formattedImages = uploadedImages.map((img) => ({
        url: img.finalUrl || `uploaded-image-${Date.now()}.webp`,
        alt: img.alt
      }))

      if (formattedImages.length === 0 && (!initialData || !initialData.images || initialData.images.length === 0)) {
        console.error('No images uploaded')
        alert('Please upload at least one image')
        return
      }

      const formattedData = {
        ...data,
        slug: data.slug || undefined,
        gtin: data.gtin || undefined,
        mpn: data.mpn || undefined,
        allergens: data.allergens || undefined,
        rating: data.rating || undefined,
        keywords: data.keywords.filter(k => k !== ""),
        tags: data.tags.filter(t => t !== ""),
        availabilityStatus: data.availabilityStatus ? 'in_stock' : 'out_of_stock',
        images: formattedImages.length > 0 ? formattedImages : (initialData?.images?.map(img => ({ url: img.url, alt: img.alt })) || []),
        thumbnailUrl: formattedImages[0]?.url || initialData?.thumbnailUrl || "", 
      }

      console.log('Formatted data for API:', formattedData)

      if (initialData) {
        console.log('Updating product:', initialData._id)
        const result = await updateProduct({
          variables: {
            id: initialData._id,
            input: formattedData
          }
        })
        console.log('Update result:', result)
      } else {
        console.log('Creating new product')
        const result = await createProduct({
          variables: {
            input: formattedData
          }
        })
        console.log('Create result:', result)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save product:", error)
      alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("Validation errors:", errors))} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="brand" render={({ field }) => (
              <FormItem>
                <FormLabel>Brand *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sku" render={({ field }) => (
              <FormItem>
                <FormLabel>SKU *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="gtin" render={({ field }) => (
              <FormItem>
                <FormLabel>GTIN</FormLabel>
                <FormControl><Input {...field} placeholder="EAN/UPC" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mpn" render={({ field }) => (
              <FormItem>
                <FormLabel>MPN</FormLabel>
                <FormControl><Input {...field} placeholder="Manufacturer Part Number" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select 
                  disabled={categoriesLoading} 
                  onValueChange={field.onChange} 
                  value={field.value} 
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">No active categories found</div>
                    ) : (
                      categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <WysiwygEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter product description..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="space-y-4 w-full">
          <h3 className="text-lg font-semibold">Images *</h3>
          <ImageUpload
            onImagesChange={handleImagesChange}
            initialImages={initialData?.images as any || []}
            maxFiles={10}
          />
          {uploadedImages.length === 0 && (
            <p className="text-sm text-muted-foreground">Please upload at least one image</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl><Input type="number" step="1" min="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mrp" render={({ field }) => (
              <FormItem>
                <FormLabel>MRP *</FormLabel>
                <FormControl><Input type="number" step="1" min="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discountPercent" render={({ field }) => (
              <FormItem>
                <FormLabel>Discount %</FormLabel>
                <FormControl><Input type="number" step="1" min="0" max="100" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <FormField control={form.control} name="currency" render={({ field }) => (
              <FormItem>
                <FormLabel>Currency *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discountSource" render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Source *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dimensions</h3>
          <div className="grid grid-cols-5 gap-4">
            <FormField control={form.control} name="length" render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm) *</FormLabel>
                <FormControl><Input type="number" step="1" min="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="height" render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm) *</FormLabel>
                <FormControl><Input type="number" step="1" min="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="breadth" render={({ field }) => (
              <FormItem>
                <FormLabel>Breadth (cm) *</FormLabel>
                <FormControl><Input type="number" step="1" min="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weight" render={({ field }) => (
              <FormItem>
                <FormLabel>Weight *</FormLabel>
                <FormControl><Input type="number" step="1" min="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weightUnit" render={({ field }) => (
              <FormItem>
                <FormLabel>Unit *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="packageSize" render={({ field }) => (
              <FormItem>
                <FormLabel>Package Size *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shelfLife" render={({ field }) => (
              <FormItem>
                <FormLabel>Shelf Life *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <FormField control={form.control} name="ingredients" render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients *</FormLabel>
              <FormControl><Textarea {...field} rows={2} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="allergens" render={({ field }) => (
            <FormItem>
              <FormLabel>Allergens</FormLabel>
              <FormControl><Textarea {...field} rows={2} placeholder="e.g. Peanuts, Milk, Soy" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="keywords" render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <TagInput 
                    value={field.value || []} 
                    onChange={field.onChange}
                    placeholder="Type keyword and press Enter" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tags" render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput 
                    value={field.value || []} 
                    onChange={field.onChange}
                    placeholder="Type tag and press Enter" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="stockQuantity" render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity *</FormLabel>
                <FormControl><Input type="number" min="0" step="1" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="availabilityStatus" render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }} 
                  />
                </FormControl>
                <FormLabel className="!mt-0">In Stock</FormLabel>
              </FormItem>
            )} />
          </div>
          <div className="flex gap-4">
            <FormField control={form.control} name="isVegetarian" render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Vegetarian</FormLabel>
              </FormItem>
            )} />
            <FormField control={form.control} name="isGlutenFree" render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Gluten Free</FormLabel>
              </FormItem>
            )} />
            <FormField control={form.control} name="favourite" render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Favourite</FormLabel>
              </FormItem>
            )} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  )
}
