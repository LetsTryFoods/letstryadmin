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
  useAdminRoles,
  useDeleteAdminRole,
  useToggleAdminRoleActive,
  AdminRole,
} from "@/lib/rbac/useRbac";
import { usePermissionActions } from "@/lib/rbac/AuthContext";
import { RoleForm } from "./RoleForm";
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, Shield, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

export function RolesTab() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<AdminRole | null>(null);

  // Get CRUD permissions for user-management page
  const { canCreate, canUpdate, canDelete } = usePermissionActions("user-management");

  const { data, loading, refetch } = useAdminRoles(page, 10);
  const [deleteRole, { loading: deleting }] = useDeleteAdminRole();
  const [toggleActive] = useToggleAdminRoleActive();

  const roles: AdminRole[] = data?.adminRoles?.items || [];
  const meta = data?.adminRoles?.meta;

  const handleCreate = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (role: AdminRole) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (role: AdminRole) => {
    if (role.isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole({ variables: { id: roleToDelete._id } });
      toast.success("Role deleted successfully");
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
    }
  };

  const handleToggleActive = async (role: AdminRole) => {
    if (role.isSystem) {
      toast.error("Cannot deactivate system roles");
      return;
    }
    try {
      await toggleActive({ variables: { id: role._id } });
      toast.success(`Role ${role.isActive ? "deactivated" : "activated"} successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update role status");
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Manage admin roles and their permissions</CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No roles found. Create your first role.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {role.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {role.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions?.length || 0} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {role.isSystem ? (
                        <Badge variant="default" className="bg-blue-600">
                          <Lock className="h-3 w-3 mr-1" />
                          System
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Custom</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isActive ? "default" : "destructive"}>
                        {role.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canUpdate && !role.isSystem && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(role)}
                            title={role.isActive ? "Deactivate" : "Activate"}
                          >
                            {role.isActive ? (
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
                            onClick={() => handleEdit(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && !role.isSystem && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(role)}
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

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Page {meta.page} of {meta.totalPages} ({meta.totalCount} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.hasPreviousPage}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.hasNextPage}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Role Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Update the role's permissions"
                : "Create a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            initialData={editingRole}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{roleToDelete?.name}"? Users with this
              role will lose their permissions.
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
