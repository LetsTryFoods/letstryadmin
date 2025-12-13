"use client"

import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag,
  IndianRupee,
  Ban,
  CheckCircle,
  XCircle,
  Trash2,
  Home,
  Building2,
  MoreHorizontal
} from "lucide-react"
import { Customer, CustomerStatus } from "@/lib/customers/useCustomers"

interface CustomerDetailsDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (customer: Customer, status: CustomerStatus) => void
  onDelete: (customer: Customer) => void
}

const statusConfig: Record<CustomerStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  ACTIVE: { label: "Active", variant: "default" },
  INACTIVE: { label: "Inactive", variant: "secondary" },
  BLOCKED: { label: "Blocked", variant: "destructive" }
}

const orderStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  PROCESSING: { label: "Processing", variant: "default" },
  SHIPPED: { label: "Shipped", variant: "default" },
  DELIVERED: { label: "Delivered", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  REFUNDED: { label: "Refunded", variant: "outline" }
}

const addressTypeIcons = {
  HOME: Home,
  WORK: Building2,
  OTHER: MoreHorizontal
}

export default function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
  onStatusChange,
  onDelete
}: CustomerDetailsDialogProps) {
  const status = statusConfig[customer.status]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const avgOrderValue = customer.totalOrders > 0 
    ? Math.round(customer.totalSpent / customer.totalOrders) 
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Complete information about this customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {customer.avatar ? (
                  <img src={customer.avatar} alt={customer.name} />
                ) : (
                  <AvatarFallback className="text-lg">{getInitials(customer.name)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{customer.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
              </div>
            </div>
            <Badge variant={status.variant} className="text-sm">
              {status.label}
            </Badge>
          </div>

          <Separator />

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                </div>
                <p className="text-2xl font-bold mt-1">{customer.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                </div>
                <p className="text-2xl font-bold mt-1">{formatCurrency(customer.totalSpent)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Avg Order</span>
                </div>
                <p className="text-2xl font-bold mt-1">{formatCurrency(avgOrderValue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Member Since</span>
                </div>
                <p className="text-lg font-semibold mt-1">
                  {format(new Date(customer.createdAt), 'MMM yyyy')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Addresses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Saved Addresses ({customer.addresses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.addresses.length === 0 ? (
                <p className="text-muted-foreground text-sm">No addresses saved</p>
              ) : (
                <div className="space-y-3">
                  {customer.addresses.map((address) => {
                    const Icon = addressTypeIcons[address.type]
                    return (
                      <div 
                        key={address._id} 
                        className="p-3 border rounded-lg flex items-start gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {address.type}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{address.fullName}</p>
                          <p className="text-muted-foreground">{address.phone}</p>
                          <p className="mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p>
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.landmark && (
                            <p className="text-muted-foreground">Landmark: {address.landmark}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {customer.recentOrders.map((order) => {
                    const orderStatus = orderStatusConfig[order.status] || { label: order.status, variant: "secondary" as const }
                    return (
                      <div 
                        key={order._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={orderStatus.variant}>
                            {orderStatus.label}
                          </Badge>
                          <p className="font-semibold">{formatCurrency(order.total)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Actions:</span>
            {customer.status !== 'ACTIVE' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange(customer, 'ACTIVE')}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Mark Active
              </Button>
            )}
            {customer.status !== 'INACTIVE' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange(customer, 'INACTIVE')}
              >
                <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                Mark Inactive
              </Button>
            )}
            {customer.status !== 'BLOCKED' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange(customer, 'BLOCKED')}
              >
                <Ban className="mr-2 h-4 w-4 text-red-600" />
                Block Customer
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(customer)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
