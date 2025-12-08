'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { footerFormSchema, FooterFormValues } from "@/lib/validations/footer.schema"

interface FooterFormProps {
  onClose: () => void
  initialData?: any | null
  createFooter: any
  updateFooter: any
}

export function FooterForm({ onClose, initialData, createFooter, updateFooter }: FooterFormProps) {
  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerFormSchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      cin: initialData?.cin || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      exportEmail: initialData?.exportEmail || "",
      facebookUrl: initialData?.facebookUrl || "",
      instagramUrl: initialData?.instagramUrl || "",
      isActive: initialData?.isActive ?? true,
    },
  })

  const onSubmit = async (data: FooterFormValues) => {
    try {
      // Clean up empty optional fields
      const cleanedData = {
        ...data,
        exportEmail: data.exportEmail || undefined,
        facebookUrl: data.facebookUrl || undefined,
        instagramUrl: data.instagramUrl || undefined,
      }

      if (initialData) {
        await updateFooter({
          variables: {
            id: initialData._id,
            input: cleanedData
          }
        })
      } else {
        await createFooter({
          variables: {
            input: cleanedData
          }
        })
      }
      onClose()
    } catch (error) {
      console.error("Failed to save footer detail:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Earth Crust Pvt Ltd" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CIN *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., U15549DL2020PTC365385" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="e.g., 329, 1st Floor, Indra Vihar, Delhi-110009" 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="e.g., ecom@earthcrust.co.in" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., +91-9654-932-262" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="exportEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Export Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="e.g., export@earthcrust.co.in" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., https://facebook.com/letstry" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., https://instagram.com/letstry" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Is Active</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Create'} Footer Detail
          </Button>
        </div>
      </form>
    </Form>
  )
}
