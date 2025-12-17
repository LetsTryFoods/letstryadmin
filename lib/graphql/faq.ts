import { gql } from "@apollo/client"

// ==================== FRAGMENTS ====================
export const FAQ_FRAGMENT = gql`
  fragment FAQFields on FAQ {
    _id
    question
    answer
    category
    status
    order
    createdAt
    updatedAt
  }
`

// ==================== QUERIES ====================

// Get all FAQs (admin)
export const GET_FAQS = gql`
  ${FAQ_FRAGMENT}
  query GetFAQs($filter: FAQFilterInput) {
    faqs(filter: $filter) {
      ...FAQFields
    }
  }
`

// Get single FAQ
export const GET_FAQ = gql`
  ${FAQ_FRAGMENT}
  query GetFAQ($id: ID!) {
    faq(id: $id) {
      ...FAQFields
    }
  }
`

// Get active FAQs (public)
export const GET_ACTIVE_FAQS = gql`
  ${FAQ_FRAGMENT}
  query GetActiveFAQs($category: FAQCategory) {
    activeFAQs(category: $category) {
      ...FAQFields
    }
  }
`

// ==================== MUTATIONS ====================

// Create FAQ
export const CREATE_FAQ = gql`
  ${FAQ_FRAGMENT}
  mutation CreateFAQ($input: CreateFAQInput!) {
    createFAQ(input: $input) {
      ...FAQFields
    }
  }
`

// Update FAQ
export const UPDATE_FAQ = gql`
  ${FAQ_FRAGMENT}
  mutation UpdateFAQ($input: UpdateFAQInput!) {
    updateFAQ(input: $input) {
      ...FAQFields
    }
  }
`

// Delete FAQ
export const DELETE_FAQ = gql`
  mutation DeleteFAQ($id: ID!) {
    deleteFAQ(id: $id)
  }
`

// Toggle FAQ status
export const TOGGLE_FAQ_STATUS = gql`
  ${FAQ_FRAGMENT}
  mutation ToggleFAQStatus($id: ID!) {
    toggleFAQStatus(id: $id) {
      ...FAQFields
    }
  }
`

// Reorder FAQs
export const REORDER_FAQS = gql`
  mutation ReorderFAQs($ids: [ID!]!) {
    reorderFAQs(ids: $ids)
  }
`
