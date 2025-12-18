import { useMutation, useQuery } from '@apollo/client/react'
import {
  GET_FOOTER_DETAILS,
  GET_FOOTER_DETAIL,
  CREATE_FOOTER_DETAIL,
  UPDATE_FOOTER_DETAIL,
  DELETE_FOOTER_DETAIL
} from '@/lib/graphql/footer'

export interface SocialMediaLink {
  platform: string
  url: string
  iconUrl?: string
}

export interface QuickLink {
  label: string
  url: string
  order: number
  isActive: boolean
}

export interface FooterDetail {
  _id: string
  // Styling
  backgroundColor?: string
  textColor?: string
  linkColor?: string
  linkHoverColor?: string
  // Logo
  logoUrl?: string
  // Social Media Section
  socialMediaTitle?: string
  socialMediaLinks?: SocialMediaLink[]
  // Quick Links Section
  quickLinksTitle?: string
  quickLinks?: QuickLink[]
  // Contact Section
  contactTitle?: string
  companyName: string
  cin?: string
  address: string
  email: string
  phone: string
  exportEmailLabel?: string
  exportEmail?: string
  // Copyright
  copyrightText?: string
  // Status
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateFooterDetailInput {
  backgroundColor?: string
  textColor?: string
  linkColor?: string
  linkHoverColor?: string
  logoUrl?: string
  socialMediaTitle?: string
  socialMediaLinks?: SocialMediaLink[]
  quickLinksTitle?: string
  quickLinks?: QuickLink[]
  contactTitle?: string
  companyName: string
  cin?: string
  address: string
  email: string
  phone: string
  exportEmailLabel?: string
  exportEmail?: string
  copyrightText?: string
  isActive?: boolean
}

export interface UpdateFooterDetailInput {
  backgroundColor?: string
  textColor?: string
  linkColor?: string
  linkHoverColor?: string
  logoUrl?: string
  socialMediaTitle?: string
  socialMediaLinks?: SocialMediaLink[]
  quickLinksTitle?: string
  quickLinks?: QuickLink[]
  contactTitle?: string
  companyName?: string
  cin?: string
  address?: string
  email?: string
  phone?: string
  exportEmailLabel?: string
  exportEmail?: string
  copyrightText?: string
  isActive?: boolean
}

export const useFooterDetails = () => {
  return useQuery(GET_FOOTER_DETAILS, {
    fetchPolicy: 'cache-and-network',
  })
}

export const useFooterDetail = (id: string) => {
  return useQuery(GET_FOOTER_DETAIL, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  })
}

export const useCreateFooterDetail = () => {
  const [mutate, { loading, error }] = useMutation(CREATE_FOOTER_DETAIL, {
    refetchQueries: ['GetFooterDetails'],
    onError: (error: any) => {
      console.error('Create footer detail error:', error)
    }
  })

  return { mutate, loading, error }
}

export const useUpdateFooterDetail = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_FOOTER_DETAIL, {
    refetchQueries: ['GetFooterDetails'],
    onError: (error: any) => {
      console.error('Update footer detail error:', error)
    }
  })

  return { mutate, loading, error }
}

export const useDeleteFooterDetail = () => {
  const [mutate, { loading, error }] = useMutation(DELETE_FOOTER_DETAIL, {
    refetchQueries: ['GetFooterDetails'],
    onError: (error: any) => {
      console.error('Delete footer detail error:', error)
    }
  })

  return { mutate, loading, error }
}
