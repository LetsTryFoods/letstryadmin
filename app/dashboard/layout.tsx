import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { AppNavbar } from "./components/app-navbar"
import { AuthProvider } from "@/lib/rbac/AuthContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppNavbar />
          <main className="flex-1">
            <div className="p-4">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}