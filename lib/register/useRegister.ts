import { useMutation } from '@tanstack/react-query'
import api from '@/lib/axios'

export interface RegisterData {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  user: any
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<RegisterResponse> => {
      const response = await api.post('/admin/auth/register', data)
      return response.data
    },
  })
}