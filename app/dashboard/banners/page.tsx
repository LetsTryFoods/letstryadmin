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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useBanners, useCreateBanner, useUpdateBanner, useUpdateBannerActive, useDeleteBanner } from "@/lib/banners/useBanners"
import { ColumnSelector, ColumnDefinition } from "@/app/dashboard/components/column-selector"
import { ImagePreviewDialog } from "@/app/dashboard/components/image-preview-dialog"

const allColumns: ColumnDefinition[] = [
  { key: "_id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "headline", label: "Headline" },
  { key: "subheadline", label: "Subheadline" },
  { key: "description", label: "Description" },
  { key: "imageUrl", label: "Image URL" },
  { key: "mobileImageUrl", label: "Mobile Image URL" },
  { key: "thumbnailUrl", label: "Thumbnail URL" },
  { key: "url", label: "URL" },
  { key: "ctaText", label: "CTA Text" },
  { key: "position", label: "Position" },
  { key: "isActive", label: "Active" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "backgroundColor", label: "Background Color" },
  { key: "textColor", label: "Text Color" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
]

// Banner data is now fetched from API

export default function BannersPage() {
  const [selectedColumns, setSelectedColumns] = useState([
    "name", "headline", "isActive", "position", "createdAt"
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null)

  // API hooks
  const { data: bannersData, loading: bannersLoading, error: bannersError } = useBanners()
  const { mutate: createBanner, loading: createLoading } = useCreateBanner()
  const { mutate: updateBanner, loading: updateLoading } = useUpdateBanner()
  const { mutate: updateBannerActive, loading: updateActiveLoading } = useUpdateBannerActive()
  const { mutate: deleteBanner, loading: deleteLoading } = useDeleteBanner()

  const banners = (bannersData as any)?.banners || []

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  const handleToggleActive = async (bannerId: string) => {
    const banner = banners.find((b: any) => b._id === bannerId)
    if (banner) {
      try {
        await updateBannerActive({
          variables: {
            id: bannerId,
            isActive: !banner.isActive
          }
        })
      } catch (error) {
        console.error('Failed to toggle banner active status:', error)
      }
    }
  }

  const handleDeleteClick = (bannerId: string) => {
    setBannerToDelete(bannerId)
    setDeleteAlertOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (bannerToDelete) {
      try {
        await deleteBanner({
          variables: {
            id: bannerToDelete
          }
        })
        setBannerToDelete(null)
      } catch (error) {
        console.error('Failed to delete banner:', error)
      }
    }
    setDeleteAlertOpen(false)
  }

  const handleEdit = (bannerId: string) => {
    const banner = banners.find((b: any) => b._id === bannerId)
    if (banner) {
      setEditingBanner(banner)
      setIsDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingBanner(null)
  }

  const handleAddBanner = () => {
    setEditingBanner(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Banners</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddBanner}>Add Banner</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
              </DialogHeader>
              <BannerForm 
                onClose={handleCloseDialog} 
                initialData={editingBanner}
                createBanner={createBanner}
                updateBanner={updateBanner}
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
          {bannersLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Loading banners...</p>
            </div>
          ) : bannersError ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-destructive">Error loading banners: {bannersError.message}</p>
            </div>
          ) : (
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
              {banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={selectedColumns.length + 1} className="text-center text-muted-foreground">
                    No banners found. Add your first banner to get started.
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner: any) => (
                  <TableRow key={banner._id}>
                    {selectedColumns.map(columnKey => (
                      <TableCell key={columnKey}>
                        {columnKey === 'isActive' ? (
                          <Switch
                            checked={banner.isActive}
                            onCheckedChange={() => handleToggleActive(banner._id)}
                          />
                        ) : columnKey === 'imageUrl' || columnKey === 'mobileImageUrl' || columnKey === 'thumbnailUrl' ? (
                          <button
                            onClick={() => setImagePreview({ 
                              url: String(banner[columnKey as keyof typeof banner] || ''),
                              title: columnKey === 'imageUrl' ? 'Image' : columnKey === 'mobileImageUrl' ? 'Mobile Image' : 'Thumbnail'
                            })}
                            className="text-blue-600 hover:text-blue-800 underline text-left max-w-[200px] truncate block"
                          >
                            {String(banner[columnKey as keyof typeof banner] || '')}
                          </button>
                        ) : (
                          String(banner[columnKey as keyof typeof banner] || '')
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
                          <DropdownMenuItem onClick={() => handleEdit(banner._id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(banner._id)}
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
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the banner
              and you will not be able to recover it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
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

// Zod schema for banner form validation
const bannerFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  headline: z.string().min(1, { message: "Headline is required" }),
  subheadline: z.string().min(1, { message: "Subheadline is required" }),
  description: z.string().optional(),
  imageUrl: z.string().min(1, { message: "Image URL is required" }),
  mobileImageUrl: z.string().min(1, { message: "Mobile Image URL is required" }),
  thumbnailUrl: z.string().optional(),
  url: z.string().min(1, { message: "URL is required" }),
  ctaText: z.string().min(1, { message: "CTA Text is required" }),
  position: z.coerce.number().min(0, { message: "Position must be 0 or greater" }),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
})

type BannerFormValues = z.infer<typeof bannerFormSchema>

interface BannerFormProps {
  onClose: () => void
  initialData?: any | null
  createBanner?: any
  updateBanner?: any
}

function BannerForm({ onClose, initialData, createBanner, updateBanner }: BannerFormProps) {
  // Helper function to format ISO date to datetime-local format
  const formatDateForInput = (isoDate: string | null | undefined) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    return date.toISOString().slice(0, 16)
  }

  const form = useForm({
    // @ts-ignore - zod v4 compatibility issue with resolver
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      headline: initialData?.headline || "",
      subheadline: initialData?.subheadline || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      mobileImageUrl: initialData?.mobileImageUrl || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      url: initialData?.url || "",
      ctaText: initialData?.ctaText || "",
      position: initialData?.position || 0,
      isActive: initialData?.isActive ?? true,
      startDate: formatDateForInput(initialData?.startDate),
      endDate: formatDateForInput(initialData?.endDate),
      backgroundColor: initialData?.backgroundColor || "",
      textColor: initialData?.textColor || "",
    },
  })

  const onSubmit = async (data: any) => {
    try {
      // Format dates for GraphQL
      const formattedData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      }

      if (initialData) {
        // Update existing banner
        await updateBanner({
          variables: {
            id: initialData._id,
            input: formattedData
          }
        })
      } else {
        // Create new banner
        await createBanner({
          variables: {
            input: formattedData
          }
        })
      }
      onClose()
    } catch (error) {
      console.error("Failed to save banner:", error)
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subheadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subheadline *</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Image URL *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Image URL *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ctaText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Text *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={field.value as number}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="#000000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="#FFFFFF" />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Is Active</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Banner</Button>
        </div>
      </form>
    </Form>
  )
}