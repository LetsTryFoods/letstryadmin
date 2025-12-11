import { gql } from '@apollo/client'

// Fragment for variant fields
const VARIANT_FIELDS = `
  _id
  sku
  name
  price
  mrp
  discountPercent
  discountSource
  weight
  weightUnit
  packageSize
  length
  height
  breadth
  stockQuantity
  availabilityStatus
  images {
    url
    alt
  }
  thumbnailUrl
  isDefault
  isActive
`

// Fragment for SEO fields
const SEO_FIELDS = `
  _id
  productId
  metaTitle
  metaDescription
  metaKeywords
  canonicalUrl
  ogTitle
  ogDescription
  ogImage
  createdAt
  updatedAt
`

export const GET_PRODUCTS = gql`
  query GetProducts($pagination: PaginationInput!, $includeOutOfStock: Boolean!) {
    products(pagination: $pagination, includeOutOfStock: $includeOutOfStock) {
      items {
        _id
        name
        slug
        description
        categoryId
        brand
        gtin
        mpn
        currency
        ingredients
        allergens
        shelfLife
        isVegetarian
        isGlutenFree
        variants {
          ${VARIANT_FIELDS}
        }
        rating
        ratingCount
        keywords
        tags
        isArchived
        favourite
        createdAt
        updatedAt
        category {
          id
          name
          slug
        }
        defaultVariant {
          ${VARIANT_FIELDS}
        }
        priceRange {
          min
          max
        }
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
`

// Minimal product query for SEO page (avoids numeric fields that may return Infinity)
export const GET_PRODUCTS_MINIMAL = gql`
  query GetProductsMinimal($pagination: PaginationInput!, $includeOutOfStock: Boolean!) {
    products(pagination: $pagination, includeOutOfStock: $includeOutOfStock) {
      items {
        _id
        name
        slug
        brand
        isArchived
        category {
          id
          name
          slug
        }
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
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      _id
      name
      slug
      description
      categoryId
      brand
      gtin
      mpn
      currency
      ingredients
      allergens
      shelfLife
      isVegetarian
      isGlutenFree
      variants {
        ${VARIANT_FIELDS}
      }
      rating
      ratingCount
      keywords
      tags
      isArchived
      favourite
      createdAt
      updatedAt
      category {
        id
        name
        slug
      }
      defaultVariant {
        ${VARIANT_FIELDS}
      }
      priceRange {
        min
        max
      }
      availableVariants {
        ${VARIANT_FIELDS}
      }
      seo {
        ${SEO_FIELDS}
      }
    }
  }
`

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      _id
      name
      slug
      description
      categoryId
      brand
      gtin
      mpn
      currency
      ingredients
      allergens
      shelfLife
      isVegetarian
      isGlutenFree
      variants {
        ${VARIANT_FIELDS}
      }
      rating
      ratingCount
      keywords
      tags
      isArchived
      favourite
      createdAt
      updatedAt
      category {
        id
        name
        slug
      }
      defaultVariant {
        ${VARIANT_FIELDS}
      }
      priceRange {
        min
        max
      }
      availableVariants {
        ${VARIANT_FIELDS}
      }
      seo {
        ${SEO_FIELDS}
      }
    }
  }
`

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!, $pagination: PaginationInput!) {
    productsByCategory(categoryId: $categoryId, pagination: $pagination) {
      items {
        _id
        name
        slug
        description
        categoryId
        brand
        currency
        isArchived
        favourite
        createdAt
        updatedAt
        defaultVariant {
          ${VARIANT_FIELDS}
        }
        priceRange {
          min
          max
        }
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
`

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchTerm: String!, $pagination: PaginationInput!) {
    searchProducts(searchTerm: $searchTerm, pagination: $pagination) {
      items {
        _id
        name
        slug
        description
        categoryId
        brand
        currency
        isArchived
        favourite
        createdAt
        updatedAt
        defaultVariant {
          ${VARIANT_FIELDS}
        }
        priceRange {
          min
          max
        }
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
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      _id
      name
      slug
      description
      categoryId
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      _id
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      _id
      name
    }
  }
`

export const ARCHIVE_PRODUCT = gql`
  mutation ArchiveProduct($id: ID!) {
    archiveProduct(id: $id) {
      _id
      name
      isArchived
    }
  }
`

export const UNARCHIVE_PRODUCT = gql`
  mutation UnarchiveProduct($id: ID!) {
    unarchiveProduct(id: $id) {
      _id
      name
      isArchived
    }
  }
`

export const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProductStock($id: ID!, $quantity: Int!) {
    updateProductStock(id: $id, quantity: $quantity) {
      _id
      name
      stockQuantity
      availabilityStatus
    }
  }
`
