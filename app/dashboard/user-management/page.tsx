"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "./components/UsersTab";
import { RolesTab } from "./components/RolesTab";
import { PermissionsTab } from "./components/PermissionsTab";
import { SidebarOrderTab } from "./components/SidebarOrderTab";
import { Users, Shield, Key, LayoutList } from "lucide-react";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-2">
          Manage admin users, roles, and permissions for the admin panel
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="sidebar" className="flex items-center gap-2">
            <LayoutList className="h-4 w-4" />
            <span className="hidden sm:inline">Sidebar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>

        <TabsContent value="sidebar">
          <SidebarOrderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
