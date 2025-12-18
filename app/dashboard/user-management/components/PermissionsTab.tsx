"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  usePermissions,
  useDeletePermission,
  useTogglePermissionActive,
  Permission,
} from "@/lib/rbac/useRbac";
import { usePermissionActions } from "@/lib/rbac/AuthContext";
import { PermissionForm } from "./PermissionForm";
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, Key } from "lucide-react";
import { toast } from "react-hot-toast";

export function PermissionsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const { canCreate, canUpdate, canDelete } = usePermissionActions("user-management");
  const { data, loading, refetch } = usePermissions();
  const [deletePermission, { loading: deleting }] = useDeletePermission();
  const [toggleActive] = useTogglePermissionActive();

  const permissions: Permission[] = data?.permissions || [];

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleCreate = () => {
    setEditingPermission(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!permissionToDelete) return;
    try {
      await deletePermission({ variables: { id: permissionToDelete._id } });
      toast.success("Permission deleted successfully");
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete permission");
    }
  };

  const handleToggleActive = async (permission: Permission) => {
    try {
      await toggleActive({ variables: { id: permission._id } });
      toast.success(
        `Permission ${permission.isActive ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update permission status");
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingPermission(null);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            Manage page permissions for the admin panel. These are automatically seeded.
          </CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Permission
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : permissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No permissions found. They will be seeded automatically.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
              <div key={module} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="font-semibold text-green-700 capitalize">{module} Module</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modulePermissions.map((permission) => (
                      <TableRow key={permission._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-green-50 flex items-center justify-center">
                              <Key className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium">{permission.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {permission.slug}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {permission.description || "-"}
                        </TableCell>
                        <TableCell>{permission.sortOrder}</TableCell>
                        <TableCell>
                          <Badge variant={permission.isActive ? "default" : "destructive"}>
                            {permission.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canUpdate && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(permission)}
                              title={permission.isActive ? "Deactivate" : "Activate"}
                            >
                              {permission.isActive ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            )}
                            {canUpdate && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(permission)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            )}
                            {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(permission)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Permission Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPermission ? "Edit Permission" : "Create Permission"}
            </DialogTitle>
            <DialogDescription>
              {editingPermission
                ? "Update the permission details"
                : "Add a new page permission"}
            </DialogDescription>
          </DialogHeader>
          <PermissionForm
            initialData={editingPermission}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{permissionToDelete?.name}"? This will
              affect all roles using this permission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
