import { useQuery, useMutation } from "@apollo/client/react"
import {
  GET_FAQS,
  GET_FAQ,
  GET_ACTIVE_FAQS,
  CREATE_FAQ,
  UPDATE_FAQ,
  DELETE_FAQ,
  TOGGLE_FAQ_STATUS,
  REORDER_FAQS,
} from "@/lib/graphql/faq"

// Types
export type FAQStatus = 'ACTIVE' | 'INACTIVE'
export type FAQCategory = 'GENERAL' | 'ORDERS' | 'SHIPPING' | 'PAYMENT' | 'RETURNS' | 'PRODUCTS'

export interface FAQ {
  _id: string
  question: string
  answer: string
  category: FAQCategory
  status: FAQStatus
  order: number
  createdAt: string
  updatedAt: string
}

export interface FAQFilterInput {
  category?: FAQCategory
  status?: FAQStatus
  searchQuery?: string
}

export interface CreateFAQInput {
  question: string
  answer: string
  category?: FAQCategory
  status?: FAQStatus
  order?: number
}

export interface UpdateFAQInput {
  id: string
  question?: string
  answer?: string
  category?: FAQCategory
  status?: FAQStatus
  order?: number
}

// ==================== HOOKS ====================

// Response types for GraphQL queries
interface FAQsResponse {
  faqs: FAQ[]
}

interface FAQResponse {
  faq: FAQ
}

interface ActiveFAQsResponse {
  activeFAQs: FAQ[]
}

interface MutationResponse {
  createFAQ?: FAQ
  updateFAQ?: FAQ
  deleteFAQ?: boolean
  toggleFAQStatus?: FAQ
  reorderFAQs?: FAQ[]
}

// Hook to get FAQs (admin)
export const useFAQs = (filter?: FAQFilterInput) => {
  const { data, loading, error, refetch } = useQuery<FAQsResponse>(GET_FAQS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  })

  return {
    data: data ? { faqs: data.faqs } : { faqs: [] as FAQ[] },
    loading,
    error,
    refetch,
  }
}

// Hook to get single FAQ
export const useFAQ = (id: string) => {
  const { data, loading, error } = useQuery<FAQResponse>(GET_FAQ, {
    variables: { id },
    skip: !id,
  })

  return {
    data: data ? { faq: data.faq } : { faq: null as FAQ | null },
    loading,
    error,
  }
}

// Hook to get active FAQs (public)
export const useActiveFAQs = (category?: FAQCategory) => {
  const { data, loading, error, refetch } = useQuery<ActiveFAQsResponse>(GET_ACTIVE_FAQS, {
    variables: { category },
    fetchPolicy: "cache-and-network",
  })

  return {
    data: data ? { faqs: data.activeFAQs } : { faqs: [] as FAQ[] },
    loading,
    error,
    refetch,
  }
}

// Hook to create FAQ
export const useCreateFAQ = () => {
  const [createFAQMutation, { loading, error }] = useMutation<MutationResponse>(CREATE_FAQ, {
    refetchQueries: [{ query: GET_FAQS }],
  })

  const createFAQ = async (input: CreateFAQInput) => {
    const result = await createFAQMutation({ variables: { input } })
    return result.data?.createFAQ
  }

  return {
    createFAQ,
    loading,
    error,
  }
}

// Hook to update FAQ
export const useUpdateFAQ = () => {
  const [updateFAQMutation, { loading, error }] = useMutation<MutationResponse>(UPDATE_FAQ, {
    refetchQueries: [{ query: GET_FAQS }],
  })

  const updateFAQ = async (input: UpdateFAQInput) => {
    const result = await updateFAQMutation({ variables: { input } })
    return result.data?.updateFAQ
  }

  return {
    updateFAQ,
    loading,
    error,
  }
}

// Hook to delete FAQ
export const useDeleteFAQ = () => {
  const [deleteFAQMutation, { loading, error }] = useMutation<MutationResponse>(DELETE_FAQ, {
    refetchQueries: [{ query: GET_FAQS }],
  })

  const deleteFAQ = async (id: string) => {
    const result = await deleteFAQMutation({ variables: { id } })
    return result.data?.deleteFAQ
  }

  return {
    deleteFAQ,
    loading,
    error,
  }
}

// Hook to toggle FAQ status
export const useToggleFAQStatus = () => {
  const [toggleMutation, { loading, error }] = useMutation<MutationResponse>(TOGGLE_FAQ_STATUS, {
    refetchQueries: [{ query: GET_FAQS }],
  })

  const toggleStatus = async (id: string) => {
    const result = await toggleMutation({ variables: { id } })
    return result.data?.toggleFAQStatus
  }

  return {
    toggleStatus,
    loading,
    error,
  }
}

// Hook to reorder FAQs
export const useReorderFAQs = () => {
  const [reorderMutation, { loading, error }] = useMutation<MutationResponse>(REORDER_FAQS, {
    refetchQueries: [{ query: GET_FAQS }],
  })

  const reorderFAQs = async (ids: string[]) => {
    const result = await reorderMutation({ variables: { ids } })
    return result.data?.reorderFAQs
  }

  return {
    reorderFAQs,
    loading,
    error,
  }
}

// ==================== HELPER FUNCTIONS ====================

// Helper function to get FAQ stats
export const getFAQStats = (faqs: FAQ[]) => {
  const categoryCount: Record<FAQCategory, number> = {
    GENERAL: 0,
    ORDERS: 0,
    SHIPPING: 0,
    PAYMENT: 0,
    RETURNS: 0,
    PRODUCTS: 0,
  }

  faqs.forEach((faq) => {
    categoryCount[faq.category]++
  })

  return {
    total: faqs.length,
    active: faqs.filter((f) => f.status === "ACTIVE").length,
    inactive: faqs.filter((f) => f.status === "INACTIVE").length,
    categoryCount,
  }
}

export const categoryLabels: Record<FAQCategory, string> = {
  GENERAL: "General",
  ORDERS: "Orders",
  SHIPPING: "Shipping & Delivery",
  PAYMENT: "Payment",
  RETURNS: "Returns & Refunds",
  PRODUCTS: "Products",
}
