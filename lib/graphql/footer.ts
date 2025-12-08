import { gql } from '@apollo/client'

export const GET_FOOTER_DETAILS = gql`
  query GetFooterDetails {
    footerDetails {
      _id
      companyName
      cin
      address
      email
      phone
      exportEmail
      facebookUrl
      instagramUrl
      isActive
      createdAt
      updatedAt
    }
  }
`

export const GET_FOOTER_DETAIL = gql`
  query GetFooterDetail($id: ID!) {
    footerDetail(id: $id) {
      _id
      companyName
      cin
      address
      email
      phone
      exportEmail
      facebookUrl
      instagramUrl
      isActive
      createdAt
      updatedAt
    }
  }
`

export const CREATE_FOOTER_DETAIL = gql`
  mutation CreateFooterDetail($input: CreateFooterDetailInput!) {
    createFooterDetail(input: $input) {
      _id
      companyName
      cin
      address
      email
      phone
      exportEmail
      facebookUrl
      instagramUrl
      isActive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_FOOTER_DETAIL = gql`
  mutation UpdateFooterDetail($id: ID!, $input: UpdateFooterDetailInput!) {
    updateFooterDetail(id: $id, input: $input) {
      _id
      companyName
      cin
      address
      email
      phone
      exportEmail
      facebookUrl
      instagramUrl
      isActive
      createdAt
      updatedAt
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
