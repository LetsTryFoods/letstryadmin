'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react"
import { useState } from "react"
import { useProducts, useCreateProduct, useUpdateProduct, useArchiveProduct, useUnarchiveProduct, useDeleteProduct } from "@/lib/products/useProducts"
import { ColumnSelector, ColumnDefinition } from "@/app/dashboard/components/column-selector"
import { ImagePreviewDialog } from "@/app/dashboard/components/image-preview-dialog"
import { Pagination } from "@/app/dashboard/components/pagination"
import { ProductForm } from "./_components/product-form"

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
            <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-7xl">
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
                              <span className={product.isArchived ? "text-orange-600" : "text-green-600"}>
                                {product.isArchived ? 'Archived' : 'Active'}
                              </span>
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
                              <span className={typeof product.availabilityStatus === 'boolean' ? (product.availabilityStatus ? 'text-green-600' : 'text-red-600') : (product.availabilityStatus === 'in_stock' ? 'text-green-600' : 'text-red-600')}>
                                {typeof product.availabilityStatus === 'boolean' ? (product.availabilityStatus ? 'In Stock' : 'Out of Stock') : (product.availabilityStatus === 'in_stock' ? 'In Stock' : 'Out of Stock')}
                              </span>
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


