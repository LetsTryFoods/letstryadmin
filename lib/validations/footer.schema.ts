import { z } from "zod"

export const socialMediaLinkSchema = z.object({
  platform: z.string().min(1, { message: "Platform name is required" }),
  url: z.string().url({ message: "Invalid URL" }),
  iconUrl: z.string().optional(),
})

export const quickLinkSchema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  url: z.string().min(1, { message: "URL is required" }),
  order: z.number(),
  isActive: z.boolean(),
})

export const footerFormSchema = z.object({
  // Styling
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  linkColor: z.string().optional(),
  linkHoverColor: z.string().optional(),
  
  // Logo
  logoUrl: z.string().optional(),
  
  // Social Media Section
  socialMediaTitle: z.string().optional(),
  socialMediaLinks: z.array(socialMediaLinkSchema).optional(),
  
  // Quick Links Section
  quickLinksTitle: z.string().optional(),
  quickLinks: z.array(quickLinkSchema).optional(),
  
  // Contact Section
  contactTitle: z.string().optional(),
  companyName: z.string().min(1, { message: "Company Name is required" }),
  cin: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  exportEmailLabel: z.string().optional(),
  exportEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  
  // Copyright
  copyrightText: z.string().optional(),
  
  // Status
  isActive: z.boolean(),
})

export type SocialMediaLinkValues = z.infer<typeof socialMediaLinkSchema>
export type QuickLinkValues = z.infer<typeof quickLinkSchema>
export type FooterFormValues = z.infer<typeof footerFormSchema>
