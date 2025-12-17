import { gql } from '@apollo/client'

// Fragment for reusable footer fields
const FOOTER_DETAIL_FIELDS = `
  _id
  backgroundColor
  textColor
  linkColor
  linkHoverColor
  logoUrl
  socialMediaTitle
  socialMediaLinks {
    platform
    url
    iconUrl
  }
  quickLinksTitle
  quickLinks {
    label
    url
    order
    isActive
  }
  contactTitle
  companyName
  cin
  address
  email
  phone
  exportEmailLabel
  exportEmail
  copyrightText
  isActive
  createdAt
  updatedAt
`

export const GET_FOOTER_DETAILS = gql`
  query GetFooterDetails {
    footerDetails {
      ${FOOTER_DETAIL_FIELDS}
    }
  }
`

export const GET_FOOTER_DETAIL = gql`
  query GetFooterDetail($id: ID!) {
    footerDetail(id: $id) {
      ${FOOTER_DETAIL_FIELDS}
    }
  }
`

export const CREATE_FOOTER_DETAIL = gql`
  mutation CreateFooterDetail($input: CreateFooterDetailInput!) {
    createFooterDetail(input: $input) {
      ${FOOTER_DETAIL_FIELDS}
    }
  }
`

export const UPDATE_FOOTER_DETAIL = gql`
  mutation UpdateFooterDetail($id: ID!, $input: UpdateFooterDetailInput!) {
    updateFooterDetail(id: $id, input: $input) {
      ${FOOTER_DETAIL_FIELDS}
    }
  }
`

export const DELETE_FOOTER_DETAIL = gql`
  mutation DeleteFooterDetail($id: ID!) {
    deleteFooterDetail(id: $id) {
      _id
      companyName
    }
  }
`
