export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Active Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Customers</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}