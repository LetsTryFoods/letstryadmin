import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_SEO_CONTENTS,
  GET_SEO_CONTENT,
  GET_SEO_CONTENT_BY_SLUG,
  CREATE_SEO_CONTENT,
  UPDATE_SEO_CONTENT,
  DELETE_SEO_CONTENT,
  GET_SEO_PAGES,
  GET_ACTIVE_SEO_PAGES,
  CREATE_SEO_PAGE,
  UPDATE_SEO_PAGE,
  DELETE_SEO_PAGE,
  TOGGLE_SEO_PAGE_ACTIVE,
} from "@/lib/graphql/seo";

export interface SeoContent {
  _id: string;
  pageName: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeoPage {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationInput {
  page: number;
  limit: number;
}

export interface CreateSeoContentInput {
  pageName: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  isActive?: boolean;
}

export interface UpdateSeoContentInput extends Partial<CreateSeoContentInput> {}

export interface CreateSeoPageInput {
  slug: string;
  label: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateSeoPageInput extends Partial<CreateSeoPageInput> {}

// ============ SEO CONTENT HOOKS ============

// Get all SEO contents with pagination
export function useSeoContents(pagination: PaginationInput) {
  return useQuery(GET_SEO_CONTENTS, {
    variables: { pagination },
    fetchPolicy: "cache-and-network",
  });
}

// Get single SEO content by ID
export function useSeoContent(id: string) {
  return useQuery(GET_SEO_CONTENT, {
    variables: { id },
    skip: !id,
  });
}

// Get SEO content by page slug
export function useSeoContentBySlug(slug: string) {
  return useQuery(GET_SEO_CONTENT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });
}

// Create SEO content
export function useCreateSeoContent() {
  return useMutation(CREATE_SEO_CONTENT, {
    refetchQueries: ["GetSeoContents"],
  });
}

// Update SEO content
export function useUpdateSeoContent() {
  return useMutation(UPDATE_SEO_CONTENT, {
    refetchQueries: ["GetSeoContents"],
  });
}

// Delete SEO content
export function useDeleteSeoContent() {
  return useMutation(DELETE_SEO_CONTENT, {
    refetchQueries: ["GetSeoContents"],
  });
}

// ============ SEO PAGES HOOKS (Dynamic Page Options) ============

// Response types for Apollo queries
export interface SeoPagesResponse {
  seoPages: SeoPage[];
}

export interface ActiveSeoPagesResponse {
  activeSeoPages: SeoPage[];
}

// Get all SEO pages (for admin management)
export function useSeoPages() {
  return useQuery<SeoPagesResponse>(GET_SEO_PAGES, {
    fetchPolicy: "cache-and-network",
  });
}

// Get active SEO pages (for dropdown options)
export function useActiveSeoPages() {
  return useQuery<ActiveSeoPagesResponse>(GET_ACTIVE_SEO_PAGES, {
    fetchPolicy: "cache-and-network",
  });
}

// Create SEO page
export function useCreateSeoPage() {
  return useMutation(CREATE_SEO_PAGE, {
    refetchQueries: ["GetSeoPages", "GetActiveSeoPages"],
  });
}

// Update SEO page
export function useUpdateSeoPage() {
  return useMutation(UPDATE_SEO_PAGE, {
    refetchQueries: ["GetSeoPages", "GetActiveSeoPages"],
  });
}

// Delete SEO page
export function useDeleteSeoPage() {
  return useMutation(DELETE_SEO_PAGE, {
    refetchQueries: ["GetSeoPages", "GetActiveSeoPages"],
  });
}

// Toggle SEO page active status
export function useToggleSeoPageActive() {
  return useMutation(TOGGLE_SEO_PAGE_ACTIVE, {
    refetchQueries: ["GetSeoPages", "GetActiveSeoPages"],
  });
}
