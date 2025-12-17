"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useSortedPermissions,
  useReorderPermissions,
  Permission,
} from "@/lib/rbac/useRbac";
import { usePermissionActions } from "@/lib/rbac/AuthContext";
import { 
  GripVertical, 
  Loader2, 
  Save, 
  RotateCcw,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  Package,
  Image,
  FolderTree,
  Truck,
  Settings,
  Globe,
  Search,
  Tag,
  DollarSign,
  Users,
  ShoppingCart,
  ShoppingBag,
  Star,
  Bell,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Shield,
  FileText,
  LucideIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Icon mapping for visual representation
const iconMap: Record<string, LucideIcon> = {
  "dashboard": LayoutDashboard,
  "products": Package,
  "banners": Image,
  "categories": FolderTree,
  "address": Truck,
  "footer-detail": Settings,
  "seo-content": Globe,
  "sco-product": Search,
  "coupons": Tag,
  "charges": DollarSign,
  "customers": Users,
  "cards": ShoppingCart,
  "orders": ShoppingBag,
  "reviews": Star,
  "notifications": Bell,
  "reports": BarChart3,
  "faq": HelpCircle,
  "contact": MessageSquare,
  "policies": FileText,
  "rbac": Shield,
};

const getIcon = (slug: string): LucideIcon => iconMap[slug] || FileText;

export function SidebarOrderTab() {
  const { canUpdate } = usePermissionActions("user-management");
  const { data, loading, refetch } = useSortedPermissions();
  const [reorderPermissions, { loading: saving }] = useReorderPermissions();

  // Local state for drag/drop ordering
  const [orderedPermissions, setOrderedPermissions] = useState<Permission[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state when data loads
  useEffect(() => {
    if (data?.sortedPermissions) {
      setOrderedPermissions([...data.sortedPermissions]);
      setHasChanges(false);
    }
  }, [data]);

  // Move item up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...orderedPermissions];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedPermissions(newOrder);
    setHasChanges(true);
  };

  // Move item down
  const moveDown = (index: number) => {
    if (index === orderedPermissions.length - 1) return;
    const newOrder = [...orderedPermissions];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedPermissions(newOrder);
    setHasChanges(true);
  };

  // Reset to original order
  const handleReset = () => {
    if (data?.sortedPermissions) {
      setOrderedPermissions([...data.sortedPermissions]);
      setHasChanges(false);
    }
  };

  // Save new order
  const handleSave = async () => {
    try {
      const orderedIds = orderedPermissions.map((p) => p._id);
      await reorderPermissions({ variables: { orderedIds } });
      toast.success("Sidebar order saved successfully!");
      setHasChanges(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save sidebar order");
    }
  };

  // Drag and drop handlers
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...orderedPermissions];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setOrderedPermissions(newOrder);
    setDraggedIndex(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-gray-500" />
            Sidebar Order
          </CardTitle>
          <CardDescription>
            Drag and drop to reorder sidebar menu items. Changes affect all users.
          </CardDescription>
        </div>
        {canUpdate && hasChanges && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={saving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Order
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : orderedPermissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No permissions found.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 mb-4">
              💡 Tip: Drag items or use arrows to reorder. The order shown here will be the sidebar order for all users.
            </div>
            
            {orderedPermissions.map((permission, index) => {
              const IconComponent = getIcon(permission.slug);
              return (
                <div
                  key={permission._id}
                  draggable={canUpdate}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border 
                    ${draggedIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}
                    ${canUpdate ? 'cursor-grab active:cursor-grabbing hover:border-green-300 hover:bg-green-50/50' : ''}
                    transition-all duration-150
                  `}
                >
                  {/* Drag Handle */}
                  {canUpdate && (
                    <div className="text-gray-400 hover:text-gray-600">
                      <GripVertical className="h-5 w-5" />
                    </div>
                  )}

                  {/* Order Number */}
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                  </div>

                  {/* Permission Info */}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{permission.name}</div>
                    <div className="text-xs text-gray-500">
                      <code className="bg-gray-100 px-1 rounded">{permission.slug}</code>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{permission.module}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge variant={permission.isActive ? "default" : "destructive"} className="text-xs">
                    {permission.isActive ? "Active" : "Inactive"}
                  </Badge>

                  {/* Move Buttons */}
                  {canUpdate && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveDown(index)}
                        disabled={index === orderedPermissions.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info Footer */}
        {!loading && orderedPermissions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">ℹ️ How Sidebar Order Works</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• The order here determines the sidebar menu sequence for <strong>all users</strong></li>
              <li>• Users will only see items they have permission to access</li>
              <li>• Inactive permissions are hidden from the sidebar</li>
              <li>• Changes are saved to the database and take effect immediately</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
