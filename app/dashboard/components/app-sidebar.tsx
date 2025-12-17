"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { LogOut, Image, FolderTree, Tag, DollarSign, ShoppingBag, ShoppingCart, Users, Star, Bell, BarChart3, HelpCircle, MessageSquare, Shield, LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Package, Settings, LayoutDashboard, Truck, RefreshCcw, FileText, Trash2, Search, } from "lucide-react"
import { usePolicies, useDeletePolicy } from "@/lib/policies/usePolicies"
import { useState, useMemo } from "react"
import { toast } from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAdminMe, useSortedPermissions, AdminPermission } from "@/lib/rbac/useRbac"

// Map of slug to icon and URL - used as reference data (icons & URLs are frontend only)
const menuItemsMap: Record<string, { icon: LucideIcon; url: string }> = {
  "dashboard": { icon: LayoutDashboard, url: "/dashboard" },
  "products": { icon: Package, url: "/dashboard/products" },
  "banners": { icon: Image, url: "/dashboard/banners" },
  "categories": { icon: FolderTree, url: "/dashboard/categories" },
  "address": { icon: Truck, url: "/dashboard/address" },
  "footer-detail": { icon: Settings, url: "/dashboard/footer-detail" },
  "seo-content": { icon: RefreshCcw, url: "/dashboard/seo-content" },
  "sco-product": { icon: Search, url: "/dashboard/sco-product" },
  "coupons": { icon: Tag, url: "/dashboard/coupons" },
  "charges": { icon: DollarSign, url: "/dashboard/charges" },
  "customers": { icon: Users, url: "/dashboard/customers" },
  "cards": { icon: ShoppingCart, url: "/dashboard/cards" },
  "orders": { icon: ShoppingBag, url: "/dashboard/orders" },
  "reviews": { icon: Star, url: "/dashboard/reviews" },
  "notifications": { icon: Bell, url: "/dashboard/notifications" },
  "reports": { icon: BarChart3, url: "/dashboard/reports" },
  "faq": { icon: HelpCircle, url: "/dashboard/faq" },
  "contact": { icon: MessageSquare, url: "/dashboard/contact" },
  "policies": { icon: FileText, url: "/dashboard/policies" },
  "rbac": { icon: Shield, url: "/dashboard/user-management" },
}

export function AppSidebar() {
  const router = useRouter()
  const { data: policiesData } = usePolicies()
  const { mutate: deletePolicy } = useDeletePolicy()
  const { data: adminMeData, loading: adminMeLoading } = useAdminMe()
  // Fetch sorted permissions from backend (for super-admin to get correct order)
  const { data: sortedPermissionsData, loading: permissionsLoading } = useSortedPermissions()
  const policies = (policiesData as any)?.policies || []
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [policyToDelete, setPolicyToDelete] = useState<any>(null)

  // Get user permissions from adminMe
  const userPermissions: AdminPermission[] = adminMeData?.adminMe?.permissions || []
  const isSuperAdmin = adminMeData?.adminMe?.roleSlug === "super-admin"
  
  // Get all sorted permissions from backend (for super-admin)
  const allSortedPermissions = sortedPermissionsData?.sortedPermissions || []

  // Combined loading state
  const isLoading = adminMeLoading || (isSuperAdmin && permissionsLoading)

  // Build menu items based on permissions (sorted by sortOrder from backend)
  const menuItems = useMemo(() => {
    // Still loading - return empty to show skeleton
    if (isLoading) {
      return []
    }

    // Super admin - show all items from backend sorted by sortOrder
    if (isSuperAdmin && allSortedPermissions.length > 0) {
      return allSortedPermissions
        .filter((p) => menuItemsMap[p.slug]) // Only show items we have icons for
        .map((permission) => {
          const itemData = menuItemsMap[permission.slug]
          return {
            slug: permission.slug,
            title: permission.name, // Title from backend
            url: itemData.url,
            icon: itemData.icon,
          }
        })
    }

    // Regular user - show only permitted items, sorted by sortOrder from permissions
    return userPermissions
      .filter((p) => p.actions.length > 0 && menuItemsMap[p.slug])
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((permission) => {
        const itemData = menuItemsMap[permission.slug]
        return {
          slug: permission.slug,
          title: permission.name, // Title from backend
          url: itemData.url,
          icon: itemData.icon,
        }
      })
  }, [userPermissions, isSuperAdmin, isLoading, allSortedPermissions])

  const handleLogout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/auth/login')
  }

  const handleDeleteClick = (policy: any) => {
    setPolicyToDelete(policy)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!policyToDelete) return

    try {
      await deletePolicy({
        variables: { id: policyToDelete._id }
      })
      toast.success('Policy deleted successfully')
      setDeleteDialogOpen(false)
      setPolicyToDelete(null)
      router.push('/dashboard')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete policy')
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Show skeleton loading state while permissions are loading */}
              {isLoading ? (
                // Skeleton loading placeholders
                Array.from({ length: 8 }).map((_, index) => (
                  <SidebarMenuItem key={`skeleton-${index}`}>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                // Render actual menu items (sorted by sortOrder from backend)
                menuItems.map((item: any) => (
                  <SidebarMenuItem key={item.slug}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center pr-2">
            Policies
            <a href="/dashboard/policies/create" className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90">
              + Add
            </a>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {policies.map((policy: any) => (
                <SidebarMenuItem key={policy._id} className="group/item">
                  <SidebarMenuButton asChild>
                    <a href={`/dashboard/policies/${policy.title}`} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{policy.title}</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteClick(policy)
                    }}
                    className="absolute right-2 top-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the policy "{policyToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}