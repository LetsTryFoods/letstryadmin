import { useMutation } from '@apollo/client/react'
import { ADMIN_LOGIN } from '@/lib/graphql/auth'

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: any
}

export const useLogin = () => {
  const [mutate, { data, loading, error }] = useMutation(ADMIN_LOGIN, {
    onCompleted: (data: any) => {
      const token = data.adminLogin
      if (token) {
        localStorage.setItem('token', token)
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error)
    }
  })
  
  return [mutate, { data, loading, error }] as const
}