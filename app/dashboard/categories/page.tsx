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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCategories, useCreateCategory, useUpdateCategory, useArchiveCategory, useUnarchiveCategory } from "@/lib/categories/useCategories"
import { ColumnSelector, ColumnDefinition } from "@/app/dashboard/components/column-selector"
import { ImagePreviewDialog } from "@/app/dashboard/components/image-preview-dialog"
import { Pagination } from "@/app/dashboard/components/pagination"

const allColumns: ColumnDefinition[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "parentId", label: "Parent ID" },
  { key: "imageUrl", label: "Image URL" },
  { key: "codeValue", label: "Code Value" },
  { key: "inCodeSet", label: "In Code Set" },
  { key: "productCount", label: "Product Count" },
  { key: "isArchived", label: "Archived" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
]

export default function CategoriesPage() {
  const [selectedColumns, setSelectedColumns] = useState([
    "name", "slug", "codeValue", "productCount", "isArchived", "createdAt"
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [categoryToArchive, setCategoryToArchive] = useState<{ id: string; isArchived: boolean } | null>(null)
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null)
  const [includeArchived, setIncludeArchived] = useState(false)

  // API hooks
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories({ page: currentPage, limit: pageSize }, includeArchived)
  const { mutate: createCategory, loading: createLoading } = useCreateCategory()
  const { mutate: updateCategory, loading: updateLoading } = useUpdateCategory()
  const { mutate: archiveCategory, loading: archiveLoading } = useArchiveCategory()
  const { mutate: unarchiveCategory, loading: unarchiveLoading } = useUnarchiveCategory()

  const categories = (categoriesData as any)?.categories?.items || []
  const meta = (categoriesData as any)?.categories?.meta || {
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

  const handleArchiveToggle = async (categoryId: string, isCurrentlyArchived: boolean) => {
    setCategoryToArchive({ id: categoryId, isArchived: isCurrentlyArchived })
    setDeleteAlertOpen(true)
  }

  const handleArchiveConfirm = async () => {
    if (categoryToArchive) {
      try {
        if (categoryToArchive.isArchived) {
          await unarchiveCategory({
            variables: {
              id: categoryToArchive.id
            }
          })
        } else {
          await archiveCategory({
            variables: {
              id: categoryToArchive.id
            }
          })
        }
        setCategoryToArchive(null)
      } catch (error) {
        console.error('Failed to toggle category archive status:', error)
      }
    }
    setDeleteAlertOpen(false)
  }

  const handleEdit = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId)
    if (category) {
      setEditingCategory(category)
      setIsDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-archived"
              checked={includeArchived}
              onCheckedChange={(checked) => setIncludeArchived(checked as boolean)}
            />
            <label
              htmlFor="include-archived"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Archived
            </label>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <CategoryForm 
                onClose={handleCloseDialog} 
                initialData={editingCategory}
                createCategory={createCategory}
                updateCategory={updateCategory}
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
          {categoriesLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : categoriesError ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-destructive">Error loading categories: {categoriesError.message}</p>
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
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={selectedColumns.length + 1} className="text-center text-muted-foreground">
                        No categories found. Add your first category to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category: any) => (
                    <TableRow key={category.id}>
                      {selectedColumns.map(columnKey => (
                        <TableCell key={columnKey}>
                          {columnKey === 'isArchived' ? (
                            <Switch
                              checked={category.isArchived}
                              onCheckedChange={() => handleArchiveToggle(category.id, category.isArchived)}
                            />
                          ) : columnKey === 'imageUrl' ? (
                            category.imageUrl ? (
                              <button
                                onClick={() => setImagePreview({ 
                                  url: String(category.imageUrl || ''),
                                  title: 'Category Image'
                                })}
                                className="text-blue-600 hover:text-blue-800 underline text-left max-w-[200px] truncate block"
                              >
                                {String(category.imageUrl || '')}
                              </button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : columnKey === 'parentId' ? (
                            category.parentId ? String(category.parentId) : <span className="text-muted-foreground">Root</span>
                          ) : columnKey === 'description' ? (
                            <div className="max-w-[300px] truncate">
                              {String(category[columnKey as keyof typeof category] || '-')}
                            </div>
                          ) : (
                            String(category[columnKey as keyof typeof category] || '-')
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
                            <DropdownMenuItem onClick={() => handleEdit(category.id)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleArchiveToggle(category.id, category.isArchived)}
                              className={category.isArchived ? "text-green-600" : "text-orange-600"}
                            >
                              {category.isArchived ? (
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {categories.length > 0 && (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalCount={meta.totalCount}
                pageSize={meta.limit}
                hasNextPage={meta.hasNextPage}
                hasPreviousPage={meta.hasPreviousPage}
                onPageChange={handlePageChange}
              />
            )}
            </>
          )}
        </div>
      </div>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToArchive?.isArchived 
                ? "This will unarchive the category and make it visible again."
                : "This will archive the category. Archived categories are hidden by default but can be restored later."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConfirm}>
              {categoryToArchive?.isArchived ? 'Unarchive' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        imageUrl={imagePreview?.url || null}
        title={imagePreview?.title || ''}
        open={!!imagePreview}
        onOpenChange={() => setImagePreview(null)}
      />
    </div>
  )
}

// Zod schema for category form validation
const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().optional(),
  codeValue: z.string().min(1, { message: "Code Value is required" }),
  inCodeSet: z.string().min(1, { message: "In Code Set is required" }),
  isArchived: z.boolean(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  onClose: () => void
  initialData?: any | null
  createCategory?: any
  updateCategory?: any
}

function CategoryForm({ onClose, initialData, createCategory, updateCategory }: CategoryFormProps) {
  const form = useForm({
    // @ts-ignore - zod v4 compatibility issue with resolver
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      parentId: initialData?.parentId || "",
      imageUrl: initialData?.imageUrl || "",
      codeValue: initialData?.codeValue || "",
      inCodeSet: initialData?.inCodeSet || "",
      isArchived: initialData?.isArchived ?? false,
    },
  })

  const onSubmit = async (data: any) => {
    try {
      // Clean up empty strings to undefined
      const formattedData = {
        ...data,
        slug: data.slug || undefined,
        description: data.description || undefined,
        parentId: data.parentId || undefined,
        imageUrl: data.imageUrl || undefined,
      }

      if (initialData) {
        // Update existing category
        await updateCategory({
          variables: {
            id: initialData.id,
            input: formattedData
          }
        })
      } else {
        // Create new category
        await createCategory({
          variables: {
            input: formattedData
          }
        })
      }
      onClose()
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Snacks" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., snacks (auto-generated if empty)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codeValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Value *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., SNACKS" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inCodeSet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In Code Set *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., FOOD_CATEGORY" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Leave empty for root category" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Category description..." rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isArchived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Is Archived</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Create'} Category
          </Button>
        </div>
      </form>
    </Form>
  )
}
