"use client";

import { useState, useMemo } from "react";
import { useProductSeoList, useDeleteProductSeo, ProductSeo } from "@/lib/product-seo/useProductSeo";
import { useProductsMinimal, Product } from "@/lib/products/useProducts";

interface ProductSeoStatus {
  productId: string;
  hasSeo: boolean;
  metaTitle?: string;
  seoData?: ProductSeo;
}

export function useProductSeoPage() {
  // State for dialogs and selected items
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSeoData, setSelectedSeoData] = useState<ProductSeo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "configured" | "not-configured">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Fetch products (minimal query to avoid Infinity error on numeric fields)
  const { data: productsData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProductsMinimal(
    { page: currentPage, limit: pageSize },
    true // Include out of stock products
  );
  
  // Fetch SEO data separately
  const { productSeoList, loading: seoLoading, refetch: refetchSeo } = useProductSeoList();
  const { deleteProductSeo, loading: deleteLoading } = useDeleteProductSeo();

  // Extract products from query result with proper typing
  const productsResponse = (productsData as any)?.products;
  const products: Product[] = productsResponse?.items || [];
  const paginationMeta = productsResponse?.meta;

  // Create a map of product ID to SEO status for quick lookup
  const seoStatusMap = useMemo(() => {
    const map = new Map<string, ProductSeoStatus>();
    
    if (productSeoList) {
      productSeoList.forEach((seo: ProductSeo) => {
        map.set(seo.productId, {
          productId: seo.productId,
          hasSeo: true,
          metaTitle: seo.metaTitle,
          seoData: seo,
        });
      });
    }
    
    return map;
  }, [productSeoList]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProducts = paginationMeta?.totalCount || products.length;
    const configuredCount = productSeoList?.length || 0;
    const notConfiguredCount = totalProducts - configuredCount;

    return {
      totalProducts,
      configuredCount,
      notConfiguredCount,
      coveragePercentage: totalProducts > 0 
        ? Math.round((configuredCount / totalProducts) * 100) 
        : 0,
    };
  }, [products, productSeoList, paginationMeta]);

  // Filter products based on search and status
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: Product) => {
      // Search filter
      const matchesSearch = 
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter - check SEO map
      const hasSeo = seoStatusMap.has(product._id);
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "configured" && hasSeo) ||
        (filterStatus === "not-configured" && !hasSeo);

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, filterStatus, seoStatusMap]);

  // Handlers
  const handleEditSeo = (product: Product) => {
    setSelectedProduct(product);
    // Get SEO from seoStatusMap
    const seoStatus = seoStatusMap.get(product._id);
    setSelectedSeoData(seoStatus?.seoData || null);
    setIsFormOpen(true);
  };

  const handleDeleteSeo = (product: Product) => {
    setSelectedProduct(product);
    // Get SEO from seoStatusMap
    const seoStatus = seoStatusMap.get(product._id);
    setSelectedSeoData(seoStatus?.seoData || null);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    setSelectedSeoData(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
    setSelectedSeoData(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    refetchSeo(); // Refetch SEO data
  };

  const handleConfirmDelete = async () => {
    if (!selectedSeoData?._id) return;

    try {
      await deleteProductSeo(selectedSeoData._id);
      handleCloseDeleteDialog();
      refetchSeo(); // Refetch SEO data
    } catch (error) {
      console.error("Failed to delete product SEO:", error);
    }
  };

  // Loading and error states
  const isLoading = productsLoading || seoLoading;
  const error = productsError;

  return {
    // Data
    products: filteredProducts,
    seoStatusMap,
    stats,
    
    // Loading states
    isLoading,
    deleteLoading,
    error,
    
    // Form dialog state
    isFormOpen,
    selectedProduct,
    selectedSeoData,
    
    // Delete dialog state
    isDeleteDialogOpen,
    
    // Filters
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    
    // Handlers
    handleEditSeo,
    handleDeleteSeo,
    handleCloseForm,
    handleCloseDeleteDialog,
    handleFormSuccess,
    handleConfirmDelete,
    
    // Refetch
    refetchSeo,
    refetchProducts,

    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    paginationMeta,
  };
}
