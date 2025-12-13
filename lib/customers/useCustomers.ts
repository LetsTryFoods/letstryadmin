// Customers Hook with Dummy Data
// TODO: Replace with actual GraphQL queries when backend is ready

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export interface CustomerAddress {
  _id: string
  type: 'HOME' | 'WORK' | 'OTHER'
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  isDefault: boolean
}

export interface OrderSummary {
  _id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
}

export interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: CustomerStatus
  addresses: CustomerAddress[]
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  recentOrders: OrderSummary[]
  createdAt: string
  updatedAt: string
}

// Dummy data for customers based on LetsTry Foods
export const dummyCustomers: Customer[] = [
  {
    _id: 'cust1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+919876543210',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr1',
        type: 'HOME',
        fullName: 'Rahul Sharma',
        phone: '+919876543210',
        addressLine1: '42, MG Road, Sector 14',
        addressLine2: 'Near City Mall',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        landmark: 'Opposite Metro Station',
        isDefault: true
      },
      {
        _id: 'addr2',
        type: 'WORK',
        fullName: 'Rahul Sharma',
        phone: '+919876543210',
        addressLine1: 'Tower B, DLF Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        isDefault: false
      }
    ],
    totalOrders: 8,
    totalSpent: 4599,
    lastOrderDate: '2024-12-10T10:30:00Z',
    recentOrders: [
      { _id: 'o1', orderNumber: 'LTF-2024-001', total: 777, status: 'DELIVERED', createdAt: '2024-12-10T10:30:00Z' },
      { _id: 'o2', orderNumber: 'LTF-2024-015', total: 549, status: 'DELIVERED', createdAt: '2024-11-25T14:20:00Z' },
      { _id: 'o3', orderNumber: 'LTF-2024-028', total: 1299, status: 'DELIVERED', createdAt: '2024-10-18T09:15:00Z' }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-12-10T10:30:00Z'
  },
  {
    _id: 'cust2',
    name: 'Priya Patel',
    email: 'priya.patel@outlook.com',
    phone: '+918765432109',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr3',
        type: 'HOME',
        fullName: 'Priya Patel',
        phone: '+918765432109',
        addressLine1: '15, Vastrapur Society',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        isDefault: true
      }
    ],
    totalOrders: 5,
    totalSpent: 2845,
    lastOrderDate: '2024-12-11T15:45:00Z',
    recentOrders: [
      { _id: 'o4', orderNumber: 'LTF-2024-002', total: 826, status: 'SHIPPED', createdAt: '2024-12-11T15:45:00Z' },
      { _id: 'o5', orderNumber: 'LTF-2024-022', total: 699, status: 'DELIVERED', createdAt: '2024-11-08T11:30:00Z' }
    ],
    createdAt: '2024-03-22T10:15:00Z',
    updatedAt: '2024-12-11T15:45:00Z'
  },
  {
    _id: 'cust3',
    name: 'Amit Kumar',
    email: 'amit.kumar@yahoo.com',
    phone: '+917654321098',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr4',
        type: 'HOME',
        fullName: 'Amit Kumar',
        phone: '+917654321098',
        addressLine1: '78, Laxmi Nagar',
        addressLine2: 'Block C',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110092',
        landmark: 'Near Laxmi Nagar Metro',
        isDefault: true
      }
    ],
    totalOrders: 12,
    totalSpent: 8750,
    lastOrderDate: '2024-12-12T08:20:00Z',
    recentOrders: [
      { _id: 'o6', orderNumber: 'LTF-2024-003', total: 549, status: 'PROCESSING', createdAt: '2024-12-12T08:20:00Z' },
      { _id: 'o7', orderNumber: 'LTF-2024-018', total: 1099, status: 'DELIVERED', createdAt: '2024-11-15T16:45:00Z' },
      { _id: 'o8', orderNumber: 'LTF-2024-031', total: 899, status: 'DELIVERED', createdAt: '2024-10-28T13:20:00Z' }
    ],
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-12-12T08:20:00Z'
  },
  {
    _id: 'cust4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '+916543210987',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr5',
        type: 'HOME',
        fullName: 'Sneha Reddy',
        phone: '+916543210987',
        addressLine1: '23, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        isDefault: true
      },
      {
        _id: 'addr6',
        type: 'OTHER',
        fullName: 'Sneha Reddy',
        phone: '+916543210987',
        addressLine1: '45, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        isDefault: false
      }
    ],
    totalOrders: 3,
    totalSpent: 1876,
    lastOrderDate: '2024-12-12T11:30:00Z',
    recentOrders: [
      { _id: 'o9', orderNumber: 'LTF-2024-004', total: 1216, status: 'CONFIRMED', createdAt: '2024-12-12T11:30:00Z' }
    ],
    createdAt: '2024-06-05T09:00:00Z',
    updatedAt: '2024-12-12T11:30:00Z'
  },
  {
    _id: 'cust5',
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    phone: '+915432109876',
    status: 'INACTIVE',
    addresses: [
      {
        _id: 'addr7',
        type: 'HOME',
        fullName: 'Vikram Singh',
        phone: '+915432109876',
        addressLine1: '56, Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302006',
        landmark: 'Near Raj Mandir Cinema',
        isDefault: true
      }
    ],
    totalOrders: 2,
    totalSpent: 1128,
    lastOrderDate: '2024-09-15T14:00:00Z',
    recentOrders: [
      { _id: 'o10', orderNumber: 'LTF-2024-056', total: 588, status: 'CANCELLED', createdAt: '2024-09-15T14:00:00Z' },
      { _id: 'o11', orderNumber: 'LTF-2024-042', total: 540, status: 'DELIVERED', createdAt: '2024-08-20T10:30:00Z' }
    ],
    createdAt: '2024-05-18T11:45:00Z',
    updatedAt: '2024-09-15T14:00:00Z'
  },
  {
    _id: 'cust6',
    name: 'Meera Nair',
    email: 'meera.nair@gmail.com',
    phone: '+914321098765',
    status: 'BLOCKED',
    addresses: [
      {
        _id: 'addr8',
        type: 'HOME',
        fullName: 'Meera Nair',
        phone: '+914321098765',
        addressLine1: '12, MG Road',
        addressLine2: 'Ernakulam',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682011',
        isDefault: true
      }
    ],
    totalOrders: 1,
    totalSpent: 0,
    lastOrderDate: '2024-12-09T16:30:00Z',
    recentOrders: [
      { _id: 'o12', orderNumber: 'LTF-2024-006', total: 508, status: 'CANCELLED', createdAt: '2024-12-09T16:30:00Z' }
    ],
    createdAt: '2024-11-28T15:20:00Z',
    updatedAt: '2024-12-09T17:00:00Z'
  },
  {
    _id: 'cust7',
    name: 'Rajesh Gupta',
    email: 'rajesh.gupta@gmail.com',
    phone: '+913210987654',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr9',
        type: 'HOME',
        fullName: 'Rajesh Gupta',
        phone: '+913210987654',
        addressLine1: '89, Hazratganj',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001',
        landmark: 'Near Sahara Ganj Mall',
        isDefault: true
      }
    ],
    totalOrders: 6,
    totalSpent: 3245,
    lastOrderDate: '2024-12-08T09:15:00Z',
    recentOrders: [
      { _id: 'o13', orderNumber: 'LTF-2024-007', total: 597, status: 'REFUNDED', createdAt: '2024-12-08T09:15:00Z' },
      { _id: 'o14', orderNumber: 'LTF-2024-035', total: 849, status: 'DELIVERED', createdAt: '2024-11-02T12:45:00Z' }
    ],
    createdAt: '2024-04-12T08:30:00Z',
    updatedAt: '2024-12-10T12:00:00Z'
  },
  {
    _id: 'cust8',
    name: 'Ananya Banerjee',
    email: 'ananya.b@gmail.com',
    phone: '+912109876543',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr10',
        type: 'HOME',
        fullName: 'Ananya Banerjee',
        phone: '+912109876543',
        addressLine1: '45, Salt Lake Sector V',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700091',
        isDefault: true
      }
    ],
    totalOrders: 4,
    totalSpent: 2196,
    lastOrderDate: '2024-12-12T16:00:00Z',
    recentOrders: [
      { _id: 'o15', orderNumber: 'LTF-2024-008', total: 699, status: 'CONFIRMED', createdAt: '2024-12-12T16:00:00Z' },
      { _id: 'o16', orderNumber: 'LTF-2024-048', total: 499, status: 'DELIVERED', createdAt: '2024-11-18T14:30:00Z' }
    ],
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-12-12T16:05:00Z'
  },
  {
    _id: 'cust9',
    name: 'Karthik Iyer',
    email: 'karthik.iyer@gmail.com',
    phone: '+911098765432',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr11',
        type: 'HOME',
        fullName: 'Karthik Iyer',
        phone: '+911098765432',
        addressLine1: '67, Anna Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
        isDefault: true
      },
      {
        _id: 'addr12',
        type: 'WORK',
        fullName: 'Karthik Iyer',
        phone: '+911098765432',
        addressLine1: 'IT Park, Sholinganallur',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600119',
        isDefault: false
      }
    ],
    totalOrders: 15,
    totalSpent: 12450,
    lastOrderDate: '2024-12-11T09:30:00Z',
    recentOrders: [
      { _id: 'o17', orderNumber: 'LTF-2024-009', total: 1549, status: 'SHIPPED', createdAt: '2024-12-11T09:30:00Z' },
      { _id: 'o18', orderNumber: 'LTF-2024-052', total: 899, status: 'DELIVERED', createdAt: '2024-11-28T11:15:00Z' },
      { _id: 'o19', orderNumber: 'LTF-2024-039', total: 1199, status: 'DELIVERED', createdAt: '2024-10-22T16:00:00Z' }
    ],
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-12-11T09:30:00Z'
  },
  {
    _id: 'cust10',
    name: 'Pooja Deshmukh',
    email: 'pooja.d@gmail.com',
    phone: '+910987654321',
    status: 'ACTIVE',
    addresses: [
      {
        _id: 'addr13',
        type: 'HOME',
        fullName: 'Pooja Deshmukh',
        phone: '+910987654321',
        addressLine1: '34, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        isDefault: true
      }
    ],
    totalOrders: 7,
    totalSpent: 4890,
    lastOrderDate: '2024-12-10T13:45:00Z',
    recentOrders: [
      { _id: 'o20', orderNumber: 'LTF-2024-010', total: 999, status: 'DELIVERED', createdAt: '2024-12-10T13:45:00Z' },
      { _id: 'o21', orderNumber: 'LTF-2024-044', total: 749, status: 'DELIVERED', createdAt: '2024-11-12T10:20:00Z' }
    ],
    createdAt: '2024-02-28T09:30:00Z',
    updatedAt: '2024-12-10T13:45:00Z'
  }
]

// Hook to get customers (using dummy data for now)
export const useCustomers = (status?: CustomerStatus) => {
  // TODO: Replace with actual GraphQL query
  const filteredCustomers = status 
    ? dummyCustomers.filter(customer => customer.status === status)
    : dummyCustomers

  return {
    data: { customers: filteredCustomers },
    loading: false,
    error: null,
    refetch: () => Promise.resolve()
  }
}

// Hook to get single customer
export const useCustomer = (id: string) => {
  // TODO: Replace with actual GraphQL query
  const customer = dummyCustomers.find(c => c._id === id)
  
  return {
    data: { customer },
    loading: false,
    error: null
  }
}

// Hook to update customer status
export const useUpdateCustomerStatus = () => {
  // TODO: Replace with actual GraphQL mutation
  const updateStatus = async (id: string, status: CustomerStatus) => {
    console.log(`Updating customer ${id} to status: ${status}`)
    return Promise.resolve({ success: true })
  }

  return {
    updateStatus,
    loading: false,
    error: null
  }
}

// Hook to delete customer
export const useDeleteCustomer = () => {
  // TODO: Replace with actual GraphQL mutation
  const deleteCustomer = async (id: string) => {
    console.log(`Deleting customer ${id}`)
    return Promise.resolve({ success: true })
  }

  return {
    deleteCustomer,
    loading: false,
    error: null
  }
}

// Helper function to get customer stats
export const getCustomerStats = (customers: Customer[]) => {
  return {
    total: customers.length,
    active: customers.filter(c => c.status === 'ACTIVE').length,
    inactive: customers.filter(c => c.status === 'INACTIVE').length,
    blocked: customers.filter(c => c.status === 'BLOCKED').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    avgOrderValue: Math.round(
      customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
      customers.reduce((sum, c) => sum + c.totalOrders, 0)
    ) || 0,
    newThisMonth: customers.filter(c => {
      const created = new Date(c.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
  }
}
