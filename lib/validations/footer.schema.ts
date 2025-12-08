import { z } from "zod"

export const footerFormSchema = z.object({
  companyName: z.string().min(1, { message: "Company Name is required" }),
  cin: z.string().min(1, { message: "CIN is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  exportEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  facebookUrl: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  instagramUrl: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  isActive: z.boolean(),
})

export type FooterFormValues = z.infer<typeof footerFormSchema>
