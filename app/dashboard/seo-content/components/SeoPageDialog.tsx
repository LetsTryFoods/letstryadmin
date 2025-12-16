"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SeoPageForm } from "./SeoPageForm";
import {
  useSeoPages,
  useCreateSeoPage,
  useUpdateSeoPage,
  useDeleteSeoPage,
  useToggleSeoPageActive,
  SeoPage,
  CreateSeoPageInput,
  UpdateSeoPageInput,
  SeoPagesResponse,
} from "@/lib/seo/useSeo";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { SeoPageFormData } from "@/lib/validations/seo.schema";

interface SeoPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SeoPageDialog({ open, onOpenChange }: SeoPageDialogProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SeoPage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<SeoPage | null>(null);

  // API Hooks
  const { data, loading, refetch } = useSeoPages();
  const [createSeoPage, { loading: creating }] = useCreateSeoPage();
  const [updateSeoPage, { loading: updating }] = useUpdateSeoPage();
  const [deleteSeoPage, { loading: deleting }] = useDeleteSeoPage();
  const [toggleActive] = useToggleSeoPageActive();

  const seoPages: SeoPage[] = (data as SeoPagesResponse)?.seoPages || [];

  const handleCreate = async (formData: SeoPageFormData) => {
    try {
      const input: CreateSeoPageInput = {
        slug: formData.slug,
        label: formData.label,
        description: formData.description || undefined,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };
      await createSeoPage({ variables: { input } });
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating SEO page:", error);
      throw error;
    }
  };

  const handleUpdate = async (formData: SeoPageFormData) => {
    if (!editingPage) return;
    try {
      const input: UpdateSeoPageInput = {
        slug: formData.slug,
        label: formData.label,
        description: formData.description || undefined,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };
      await updateSeoPage({ variables: { id: editingPage._id, input } });
      setIsFormOpen(false);
      setEditingPage(null);
      refetch();
    } catch (error) {
      console.error("Error updating SEO page:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;
    try {
      await deleteSeoPage({ variables: { id: pageToDelete._id } });
      setDeleteDialogOpen(false);
      setPageToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting SEO page:", error);
    }
  };

  const handleToggleActive = async (page: SeoPage) => {
    try {
      await toggleActive({ variables: { id: page._id } });
      refetch();
    } catch (error) {
      console.error("Error toggling active status:", error);
    }
  };

  const handleEdit = (page: SeoPage) => {
    setEditingPage(page);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (page: SeoPage) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPage(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage SEO Pages</DialogTitle>
            <DialogDescription>
              Add, edit, or remove page types that can be used for SEO entries.
              These pages will appear as options in the SEO content form.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsFormOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New Page
            </Button>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : seoPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pages found. Add your first page to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-center">Order</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seoPages.map((page) => (
                    <TableRow key={page._id}>
                      <TableCell className="font-medium">{page.label}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                          {page.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        {page.sortOrder}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={page.isActive ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(page)}
                        >
                          {page.isActive ? (
                            <ToggleRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ToggleLeft className="h-3 w-3 mr-1" />
                          )}
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(page)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDeleteDialog(page)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Page Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Edit Page" : "Add New Page"}
            </DialogTitle>
            <DialogDescription>
              {editingPage
                ? `Editing "${editingPage.label}"`
                : "Create a new page type for SEO entries"}
            </DialogDescription>
          </DialogHeader>
          <SeoPageForm
            initialData={editingPage}
            onSubmit={editingPage ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
            isLoading={creating || updating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pageToDelete?.label}"? This
              action cannot be undone.
              <br />
              <br />
              <strong>Note:</strong> Existing SEO entries using this page slug
              will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
