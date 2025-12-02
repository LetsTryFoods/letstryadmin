import { useMutation } from '@tanstack/react-query'
import api from '@/lib/axios'

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: any
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await api.post('/admin/auth/login', data)
      return response.data
    },
  })
}