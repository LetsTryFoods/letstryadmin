'use client'

import { useDashboardStats } from '@/lib/dashboard/useDashboardStats'

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats()

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="text-red-500">Error loading dashboard stats: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Archived Products</h3>
          <p className="text-2xl font-bold">{stats?.archivedProducts || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">In Stock Products</h3>
          <p className="text-2xl font-bold">{stats?.inStockProducts || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Out of Stock Products</h3>
          <p className="text-2xl font-bold">{stats?.outOfStockProducts || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Total Categories</h3>
          <p className="text-2xl font-bold">{stats?.totalCategories || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Active Banners</h3>
          <p className="text-2xl font-bold">{stats?.activeBanners || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Total Admins</h3>
          <p className="text-2xl font-bold">{stats?.totalAdmins || 0}</p>
        </div>
      </div>
    </div>
  )
}