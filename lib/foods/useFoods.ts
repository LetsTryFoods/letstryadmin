import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export interface Food {
  id?: string
  _id?: string
  name: string
  description: string
  imageUrl?: string
  price: number
  category: string
  eanCode?: number
  subCategory?: string
  refundPolicy?: string
  unit?: string
  disclaimer?: string
  flavour?: string
  shelfLife?: string
  dietPreference?: string
  discountPercent?: number
  discountedPrice?: number
  ranges?: string[]
  newLaunch?: boolean
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface AddFoodData {
  food: string // JSON string
  file?: File
}

export interface AddTagsData {
  foodId: string
  title: string[]
}

export const useFoods = () => {
  return useQuery({
    queryKey: ['foods'],
    queryFn: async (): Promise<Food[]> => {
      const response = await api.get('/foods')
      return response.data
    },
  })
}

export const useFood = (id: string) => {
  return useQuery({
    queryKey: ['food', id],
    queryFn: async (): Promise<Food> => {
      const response = await api.get(`/foods/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useAddFood = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddFoodData): Promise<Food> => {
      const formData = new FormData()
      formData.append('food', data.food)
      if (data.file) {
        formData.append('file', data.file)
      }

      const response = await api.post('/foods', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] })
    },
  })
}

export const useUpdateFood = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AddFoodData }): Promise<Food> => {
      const formData = new FormData()
      formData.append('food', data.food)
      if (data.file) {
        formData.append('file', data.file)
      }

      const response = await api.put(`/foods/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] })
    },
  })
}

export const useDeleteFood = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/foods/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] })
    },
  })
}

export const useAddTags = () => {
  return useMutation({
    mutationFn: async (data: AddTagsData[]): Promise<any> => {
      const response = await api.post('/foods/add-tags', data)
      return response.data
    },
  })
}