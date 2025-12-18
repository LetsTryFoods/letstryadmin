'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { footerFormSchema, FooterFormValues } from "@/lib/validations/footer.schema"
import { Plus, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      // Styling
      backgroundColor: initialData?.backgroundColor || "#1e293b",
      textColor: initialData?.textColor || "#ffffff",
      linkColor: initialData?.linkColor || "#60a5fa",
      linkHoverColor: initialData?.linkHoverColor || "#93c5fd",
      // Logo
      logoUrl: initialData?.logoUrl || "",
      // Social Media
      socialMediaTitle: initialData?.socialMediaTitle || "Follow us",
      socialMediaLinks: initialData?.socialMediaLinks || [],
      // Quick Links
      quickLinksTitle: initialData?.quickLinksTitle || "QUICK LINKS",
      quickLinks: initialData?.quickLinks || [],
      // Contact
      contactTitle: initialData?.contactTitle || "CONTACT US",
      companyName: initialData?.companyName || "",
      cin: initialData?.cin || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      exportEmailLabel: initialData?.exportEmailLabel || "For export queries mail us",
      exportEmail: initialData?.exportEmail || "",
      // Copyright
      copyrightText: initialData?.copyrightText || "",
      // Status
      isActive: initialData?.isActive ?? true,
    },
  })

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: "socialMediaLinks",
  })

  const { fields: quickLinkFields, append: appendQuickLink, remove: removeQuickLink } = useFieldArray({
    control: form.control,
    name: "quickLinks",
  })

  const onSubmit = async (data: FooterFormValues) => {
    try {
      // Clean up empty optional fields
      const cleanedData = {
        ...data,
        logoUrl: data.logoUrl || undefined,
        exportEmail: data.exportEmail || undefined,
        socialMediaTitle: data.socialMediaTitle || undefined,
        socialMediaLinks: data.socialMediaLinks?.length ? data.socialMediaLinks.map(link => ({
          ...link,
          iconUrl: link.iconUrl || undefined
        })) : undefined,
        quickLinks: data.quickLinks?.length ? data.quickLinks : undefined,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <Tabs defaultValue="styling" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="styling">Styling</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="quicklinks">Quick Links</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          {/* STYLING TAB */}
          <TabsContent value="styling" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Appearance Settings</h3>
            
            {/* Logo */}
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., https://example.com/logo.png" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="#1e293b" />
                      </FormControl>
                      <input 
                        type="color" 
                        value={field.value || "#1e293b"} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="#ffffff" />
                      </FormControl>
                      <input 
                        type="color" 
                        value={field.value || "#ffffff"} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="#60a5fa" />
                      </FormControl>
                      <input 
                        type="color" 
                        value={field.value || "#60a5fa"} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkHoverColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Hover Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="#93c5fd" />
                      </FormControl>
                      <input 
                        type="color" 
                        value={field.value || "#93c5fd"} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Copyright */}
            <FormField
              control={form.control}
              name="copyrightText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copyright Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., © 2024 Earth Crust Pvt Ltd. All rights reserved." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="contactTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., CONTACT US" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel>CIN</FormLabel>
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

            <Separator />

            <FormField
              control={form.control}
              name="exportEmailLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Email Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., For export queries mail us" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </TabsContent>

          {/* QUICK LINKS TAB */}
          <TabsContent value="quicklinks" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="quickLinksTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., QUICK LINKS" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Quick Links</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendQuickLink({ label: "", url: "", order: quickLinkFields.length, isActive: true })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>

              {quickLinkFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-start p-3 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`quickLinks.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Search" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`quickLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., /search" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`quickLinks.${index}.order`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Order</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-destructive hover:text-destructive"
                    onClick={() => removeQuickLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {quickLinkFields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                  No quick links added. Click &quot;Add Link&quot; to add one.
                </p>
              )}
            </div>
          </TabsContent>

          {/* SOCIAL MEDIA TAB */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="socialMediaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Follow us" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Social Media Links</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSocial({ platform: "", url: "", iconUrl: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>

              {socialFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start p-3 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`socialMediaLinks.${index}.platform`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Platform</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Facebook" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`socialMediaLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., https://facebook.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`socialMediaLinks.${index}.iconUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Icon URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-destructive hover:text-destructive"
                    onClick={() => removeSocial(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {socialFields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                  No social media links added. Click &quot;Add Link&quot; to add one.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

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
              <FormLabel className="mt-0!">Is Active</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
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
