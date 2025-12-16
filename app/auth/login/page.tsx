'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { useAdminLogin } from '@/lib/rbac/useRbac'
import { adminLoginSchema, AdminLoginFormData } from '@/lib/validations/rbac.schema'
import { zodResolver } from '@hookform/resolvers/zod'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  })
  const [login, { loading }] = useAdminLogin()

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const response = await login({
        variables: {
          input: {
            email: data.email.toLowerCase(),
            password: data.password,
          }
        }
      })

      const result = response.data?.adminUserLogin
      
      if (result?.accessToken) {
        // Store token
        localStorage.setItem('token', result.accessToken)
        document.cookie = `token=${result.accessToken}; path=/; max-age=86400`
        
        // Store user info for quick access
        localStorage.setItem('adminUser', JSON.stringify({
          _id: result._id,
          name: result.name,
          email: result.email,
          roleName: result.roleName,
          roleSlug: result.roleSlug,
          permissions: result.permissions,
        }))
        
        toast.success(`Welcome back, ${result.name}!`)
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Default: admin@letstry.com / Admin@123
          </div>
        </CardContent>
      </Card>
    </div>
  )
}