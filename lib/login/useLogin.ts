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

      const requestBody = {
        query: `
          mutation AdminLogin {
            adminLogin(email: "${data.email}", password: "${data.password}")
          }
        `
      }
      
      const response = await api.post('/graphql', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
    
      
      // Check for GraphQL errors
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message)
      }
      
      // GraphQL wraps response in data.data.mutationName
      const token = response.data.data?.adminLogin
      
      if (!token) {
        throw new Error('No token received from server')
      }
      
      console.log('✅ Token received:', token.substring(0, 20) + '...')
      
      return {
        token: token,
        user: null
      }
    },
  })
}