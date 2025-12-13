"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Eye, 
  MoreHorizontal, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Phone,
  Mail,
  MapPin
} from "lucide-react"
import { 
  Customer, 
  CustomerStatus, 
  useUpdateCustomerStatus, 
  useDeleteCustomer 
} from "@/lib/customers/useCustomers"
import CustomerDetailsDialog from "./CustomerDetailsDialog"

interface CustomerTableProps {
  customers: Customer[]
  onRefresh: () => void
}

const statusConfig: Record<CustomerStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  ACTIVE: { label: "Active", variant: "default" },
  INACTIVE: { label: "Inactive", variant: "secondary" },
  BLOCKED: { label: "Blocked", variant: "destructive" }
}

export default function CustomerTable({ customers, onRefresh }: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState<CustomerStatus | null>(null)

  const { updateStatus } = useUpdateCustomerStatus()
  const { deleteCustomer } = useDeleteCustomer()

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDetailsDialog(true)
  }

  const handleStatusChange = (customer: Customer, status: CustomerStatus) => {
    setSelectedCustomer(customer)
    setNewStatus(status)
    setShowStatusDialog(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDeleteDialog(true)
  }

  const confirmStatusChange = async () => {
    if (selectedCustomer && newStatus) {
      await updateStatus(selectedCustomer._id, newStatus)
      onRefresh()
    }
    setShowStatusDialog(false)
    setSelectedCustomer(null)
    setNewStatus(null)
  }

  const confirmDelete = async () => {
    if (selectedCustomer) {
      await deleteCustomer(selectedCustomer._id)
      onRefresh()
    }
    setShowDeleteDialog(false)
    setSelectedCustomer(null)
  }

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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => {
                const status = statusConfig[customer.status]
                return (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} />
                          ) : (
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {customer.addresses[0]?.city || 'No address'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </p>
                        <p className="text-sm flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{customer.totalOrders}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          {customer.status !== 'ACTIVE' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(customer, 'ACTIVE')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Mark Active
                            </DropdownMenuItem>
                          )}
                          {customer.status !== 'INACTIVE' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(customer, 'INACTIVE')}>
                              <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                              Mark Inactive
                            </DropdownMenuItem>
                          )}
                          {customer.status !== 'BLOCKED' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(customer, 'BLOCKED')}>
                              <Ban className="mr-2 h-4 w-4 text-red-600" />
                              Block Customer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCustomer(customer)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteCustomer}
        />
      )}

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of <strong>{selectedCustomer?.name}</strong> to{' '}
              <strong>{newStatus ? statusConfig[newStatus].label : ''}</strong>?
              {newStatus === 'BLOCKED' && (
                <span className="block mt-2 text-red-600">
                  This will prevent the customer from placing new orders.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the account of <strong>{selectedCustomer?.name}</strong>?
              <span className="block mt-2 text-red-600">
                This action cannot be undone. All customer data including order history will be permanently removed.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
