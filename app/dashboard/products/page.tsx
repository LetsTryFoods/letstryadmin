'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Archive, ArchiveRestore, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useProducts, useCreateProduct, useUpdateProduct, useArchiveProduct, useUnarchiveProduct, useDeleteProduct } from "@/lib/products/useProducts"
import { ColumnSelector, ColumnDefinition } from "@/app/dashboard/components/column-selector"
import { ImagePreviewDialog } from "@/app/dashboard/components/image-preview-dialog"
import { Pagination } from "@/app/dashboard/components/pagination"

const allColumns: ColumnDefinition[] = [
  { key: "_id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "brand", label: "Brand" },
  { key: "sku", label: "SKU" },
  { key: "categoryId", label: "Category ID" },
  { key: "price", label: "Price" },
  { key: "mrp", label: "MRP" },
  { key: "discountPercent", label: "Discount %" },
  { key: "thumbnailUrl", label: "Thumbnail" },
  { key: "stockQuantity", label: "Stock" },
  { key: "availabilityStatus", label: "Status" },
  { key: "isVegetarian", label: "Vegetarian" },
  { key: "isGlutenFree", label: "Gluten Free" },
  { key: "isArchived", label: "Archived" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
]

export default function ProductsPage() {
  const [selectedColumns, setSelectedColumns] = useState([
    "name", "brand", "sku", "price", "stockQuantity", "availabilityStatus", "isArchived"
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [productToAction, setProductToAction] = useState<{ id: string; action: 'archive' | 'unarchive' | 'delete'; isArchived?: boolean } | null>(null)
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null)
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false)

  const { data: productsData, loading: productsLoading, error: productsError } = useProducts({ page: currentPage, limit: pageSize }, includeOutOfStock)
  const { mutate: createProduct } = useCreateProduct()
  const { mutate: updateProduct } = useUpdateProduct()
  const { mutate: archiveProduct } = useArchiveProduct()
  const { mutate: unarchiveProduct } = useUnarchiveProduct()
  const { mutate: deleteProduct } = useDeleteProduct()

  const products = (productsData as any)?.products?.items || []
  const meta = (productsData as any)?.products?.meta || {
    totalCount: 0,
    page: 1,
    limit: pageSize,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  }

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAction = async (productId: string, action: 'archive' | 'unarchive' | 'delete', isArchived?: boolean) => {
    setProductToAction({ id: productId, action, isArchived })
    setDeleteAlertOpen(true)
  }

  const handleActionConfirm = async () => {
    if (productToAction) {
      try {
        if (productToAction.action === 'archive') {
          await archiveProduct({ variables: { id: productToAction.id } })
        } else if (productToAction.action === 'unarchive') {
          await unarchiveProduct({ variables: { id: productToAction.id } })
        } else if (productToAction.action === 'delete') {
          await deleteProduct({ variables: { id: productToAction.id } })
        }
        setProductToAction(null)
      } catch (error) {
        console.error(`Failed to ${productToAction.action} product:`, error)
      }
    }
    setDeleteAlertOpen(false)
  }

  const handleStatusToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus
      await updateProduct({
        variables: {
          id: productId,
          input: {
            availabilityStatus: newStatus ? 'in_stock' : 'out_of_stock'
          }
        }
      })
    } catch (error) {
      console.error('Failed to update product status:', error)
    }
  }

  const handleEdit = (productId: string) => {
    const product = products.find((p: any) => p._id === productId)
    if (product) {
      setEditingProduct(product)
      setIsDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-out-of-stock"
              checked={includeOutOfStock}
              onCheckedChange={(checked) => setIncludeOutOfStock(checked as boolean)}
            />
            <label
              htmlFor="include-out-of-stock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Out of Stock
            </label>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <ProductForm 
                onClose={handleCloseDialog} 
                initialData={editingProduct}
                createProduct={createProduct}
                updateProduct={updateProduct}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <ColumnSelector
          allColumns={allColumns}
          selectedColumns={selectedColumns}
          onColumnToggle={handleColumnToggle}
        />

        <div className="rounded-md border">
          {productsLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-destructive">Error loading products: {productsError.message}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map(columnKey => {
                      const column = allColumns.find(c => c.key === columnKey)
                      return (
                        <TableHead key={columnKey}>{column?.label}</TableHead>
                      )
                    })}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={selectedColumns.length + 1} className="text-center text-muted-foreground">
                        No products found. Add your first product to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product: any) => (
                      <TableRow key={product._id}>
                        {selectedColumns.map(columnKey => (
                          <TableCell key={columnKey}>
                            {columnKey === 'isArchived' ? (
                              <Switch
                                checked={product.isArchived}
                                onCheckedChange={() => handleAction(product._id, product.isArchived ? 'unarchive' : 'archive', product.isArchived)}
                              />
                            ) : columnKey === 'thumbnailUrl' ? (
                              product.thumbnailUrl ? (
                                <button
                                  onClick={() => setImagePreview({ 
                                    url: String(product.thumbnailUrl || ''),
                                    title: 'Product Thumbnail'
                                  })}
                                  className="text-blue-600 hover:text-blue-800 underline text-left max-w-[200px] truncate block"
                                >
                                  View Image
                                </button>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )
                            ) : columnKey === 'price' || columnKey === 'mrp' ? (
                              formatCurrency(product[columnKey], product.currency)
                            ) : columnKey === 'isVegetarian' || columnKey === 'isGlutenFree' ? (
                              product[columnKey] ? '✓' : '✗'
                            ) : columnKey === 'availabilityStatus' ? (
                              <Switch
                                checked={typeof product.availabilityStatus === 'boolean' ? product.availabilityStatus : product.availabilityStatus === 'in_stock'}
                                onCheckedChange={() => handleStatusToggle(product._id, typeof product.availabilityStatus === 'boolean' ? product.availabilityStatus : product.availabilityStatus === 'in_stock')}
                              />
                            ) : (
                              <div className="max-w-[200px] truncate">
                                {String(product[columnKey as keyof typeof product] || '-')}
                              </div>
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(product._id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleAction(product._id, product.isArchived ? 'unarchive' : 'archive', product.isArchived)}
                                className={product.isArchived ? "text-green-600" : "text-orange-600"}
                              >
                                {product.isArchived ? (
                                  <>
                                    <ArchiveRestore className="mr-2 h-4 w-4" />
                                    Unarchive
                                  </>
                                ) : (
                                  <>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAction(product._id, 'delete')}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {products.length > 0 && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  totalCount={meta.totalCount}
                  pageSize={meta.limit}
                  onPageChange={handlePageChange}
                  hasNextPage={meta.hasNextPage}
                  hasPreviousPage={meta.hasPreviousPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {productToAction?.action === 'delete' 
                ? "This action cannot be undone. This will permanently delete the product."
                : productToAction?.action === 'archive'
                ? "This will archive the product. Archived products are hidden by default but can be restored later."
                : "This will unarchive the product and make it visible again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleActionConfirm} className={productToAction?.action === 'delete' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}>
              {productToAction?.action === 'delete' ? 'Delete' : productToAction?.action === 'archive' ? 'Archive' : 'Unarchive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImagePreviewDialog
        imageUrl={imagePreview?.url || null}
        title={imagePreview?.title || ''}
        open={!!imagePreview}
        onOpenChange={() => setImagePreview(null)}
      />
    </div>
  )
}

const productFormSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  brand: z.string().min(1),
  sku: z.string().min(1),
  gtin: z.string().optional(),
  mpn: z.string().optional(),
  images: z.array(z.object({
    url: z.string().min(1),
    alt: z.string().min(1)
  })).min(1),
  thumbnailUrl: z.string().min(1),
  price: z.coerce.number().min(0),
  mrp: z.coerce.number().min(0),
  discountPercent: z.coerce.number().min(0).max(100),
  currency: z.string().default("INR"),
  length: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  breadth: z.coerce.number().min(0),
  weight: z.coerce.number().min(0),
  weightUnit: z.string().default("g"),
  packageSize: z.string().min(1),
  ingredients: z.string().min(1),
  allergens: z.string().optional(),
  shelfLife: z.string().min(1),
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

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  onClose: () => void
  initialData?: any | null
  createProduct?: any
  updateProduct?: any
}

function ProductForm({ onClose, initialData, createProduct, updateProduct }: ProductFormProps) {
  const form = useForm({
    // @ts-ignore - zod v4 compatibility issue
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      brand: initialData?.brand || "",
      sku: initialData?.sku || "",
      gtin: initialData?.gtin || "",
      mpn: initialData?.mpn || "",
      images: initialData?.images || [{ url: "", alt: "" }],
      thumbnailUrl: initialData?.thumbnailUrl || "",
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
      availabilityStatus: initialData?.availabilityStatus === 'in_stock' ? true : initialData?.availabilityStatus === 'out_of_stock' ? false : (initialData?.availabilityStatus ?? true),
      stockQuantity: initialData?.stockQuantity || 0,
      rating: initialData?.rating || undefined,
      ratingCount: initialData?.ratingCount || 0,
      keywords: initialData?.keywords || [],
      tags: initialData?.tags || [],
      discountSource: initialData?.discountSource || "product",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  })

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        slug: data.slug || undefined,
        gtin: data.gtin || undefined,
        mpn: data.mpn || undefined,
        allergens: data.allergens || undefined,
        rating: data.rating || undefined,
        availabilityStatus: data.availabilityStatus ? 'in_stock' : 'out_of_stock',
      }

      if (initialData) {
        await updateProduct({
          variables: {
            id: initialData._id,
            input: formattedData
          }
        })
      } else {
        await createProduct({
          variables: {
            input: formattedData
          }
        })
      }
      onClose()
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>Category ID *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl><Textarea {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Images *</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ url: "", alt: "" })}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField control={form.control} name={`images.${index}.url`} render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>URL</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`images.${index}.alt`} render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Alt</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {fields.length > 1 && (
                <Button type="button" variant="destructive" size="icon" className="mt-8" onClick={() => remove(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL *</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mrp" render={({ field }) => (
              <FormItem>
                <FormLabel>MRP *</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discountPercent" render={({ field }) => (
              <FormItem>
                <FormLabel>Discount %</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dimensions</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormField control={form.control} name="length" render={({ field }) => (
              <FormItem>
                <FormLabel>Length *</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="height" render={({ field }) => (
              <FormItem>
                <FormLabel>Height *</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="breadth" render={({ field }) => (
              <FormItem>
                <FormLabel>Breadth *</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weight" render={({ field }) => (
              <FormItem>
                <FormLabel>Weight *</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="stockQuantity" render={({ field }) => (
              <FormItem>
                <FormLabel>Stock *</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="availabilityStatus" render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
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
