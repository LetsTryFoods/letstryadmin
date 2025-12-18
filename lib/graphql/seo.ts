import { gql } from "@apollo/client";

export const GET_SEO_CONTENTS = gql`
  query GetSeoContents($pagination: PaginationInput!) {
    seoContents(pagination: $pagination) {
      items {
        _id
        pageName
        pageSlug
        metaTitle
        metaDescription
        metaKeywords
        canonicalUrl
        ogTitle
        ogDescription
        ogImage
        isActive
        createdAt
        updatedAt
      }
      meta {
        totalCount
        page
        limit
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_SEO_CONTENT = gql`
  query GetSeoContent($id: ID!) {
    seoContent(id: $id) {
      _id
      pageName
      pageSlug
      metaTitle
      metaDescription
      metaKeywords
      canonicalUrl
      ogTitle
      ogDescription
      ogImage
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SEO_CONTENT_BY_SLUG = gql`
  query GetSeoContentBySlug($slug: String!) {
    seoContentBySlug(slug: $slug) {
      _id
      pageName
      pageSlug
      metaTitle
      metaDescription
      metaKeywords
      canonicalUrl
      ogTitle
      ogDescription
      ogImage
      isActive
    }
  }
`;

export const CREATE_SEO_CONTENT = gql`
  mutation CreateSeoContent($input: CreateSeoContentInput!) {
    createSeoContent(input: $input) {
      _id
      pageName
      pageSlug
      metaTitle
      metaDescription
      metaKeywords
      canonicalUrl
      ogTitle
      ogDescription
      ogImage
      isActive
      createdAt
    }
  }
`;

export const UPDATE_SEO_CONTENT = gql`
  mutation UpdateSeoContent($id: ID!, $input: UpdateSeoContentInput!) {
    updateSeoContent(id: $id, input: $input) {
      _id
      pageName
      pageSlug
      metaTitle
      metaDescription
      metaKeywords
      canonicalUrl
      ogTitle
      ogDescription
      ogImage
      isActive
      updatedAt
    }
  }
`;

export const DELETE_SEO_CONTENT = gql`
  mutation DeleteSeoContent($id: ID!) {
    deleteSeoContent(id: $id)
  }
`;

// ============ SEO PAGES (Dynamic Page Options) ============

export const GET_SEO_PAGES = gql`
  query GetSeoPages {
    seoPages {
      _id
      slug
      label
      description
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_SEO_PAGES = gql`
  query GetActiveSeoPages {
    activeSeoPages {
      _id
      slug
      label
      description
      sortOrder
      isActive
    }
  }
`;

export const GET_SEO_PAGE = gql`
  query GetSeoPage($id: ID!) {
    seoPage(id: $id) {
      _id
      slug
      label
      description
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SEO_PAGE = gql`
  mutation CreateSeoPage($input: CreateSeoPageInput!) {
    createSeoPage(input: $input) {
      _id
      slug
      label
      description
      sortOrder
      isActive
      createdAt
    }
  }
`;

export const UPDATE_SEO_PAGE = gql`
  mutation UpdateSeoPage($id: ID!, $input: UpdateSeoPageInput!) {
    updateSeoPage(id: $id, input: $input) {
      _id
      slug
      label
      description
      sortOrder
      isActive
      updatedAt
    }
  }
`;

export const DELETE_SEO_PAGE = gql`
  mutation DeleteSeoPage($id: ID!) {
    deleteSeoPage(id: $id)
  }
`;

export const TOGGLE_SEO_PAGE_ACTIVE = gql`
  mutation ToggleSeoPageActive($id: ID!) {
    toggleSeoPageActive(id: $id) {
      _id
      isActive
    }
  }
`;
