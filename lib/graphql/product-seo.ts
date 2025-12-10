import { gql } from "@apollo/client";

// Get all product SEO entries
export const GET_PRODUCT_SEO_LIST = gql`
  query GetProductSeoList {
    productSeoList {
      _id
      productId
      productSlug
      productName
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

// Get single product SEO by product ID
export const GET_PRODUCT_SEO = gql`
  query GetProductSeo($productId: ID!) {
    productSeo(productId: $productId) {
      _id
      productId
      productSlug
      productName
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

// Get product SEO by slug
export const GET_PRODUCT_SEO_BY_SLUG = gql`
  query GetProductSeoBySlug($slug: String!) {
    productSeoBySlug(slug: $slug) {
      _id
      productId
      productSlug
      productName
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

// Create product SEO
export const CREATE_PRODUCT_SEO = gql`
  mutation CreateProductSeo($input: CreateProductSeoInput!) {
    createProductSeo(input: $input) {
      _id
      productId
      productSlug
      productName
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

// Update product SEO
export const UPDATE_PRODUCT_SEO = gql`
  mutation UpdateProductSeo($id: ID!, $input: UpdateProductSeoInput!) {
    updateProductSeo(id: $id, input: $input) {
      _id
      productId
      productSlug
      productName
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

// Delete product SEO
export const DELETE_PRODUCT_SEO = gql`
  mutation DeleteProductSeo($id: ID!) {
    deleteProductSeo(id: $id)
  }
`;
