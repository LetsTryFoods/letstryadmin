'use client'

import { useParams, useRouter } from "next/navigation"
import { useProduct } from "@/lib/products/useProducts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Tag, DollarSign, Ruler, Info, Image as ImageIcon, Layers, Barcode, Scale } from "lucide-react"
import Image from "next/image"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data, loading, error } = useProduct(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive">Error loading product: {error.message}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    )
  }

  const product = (data as any)?.product

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    )
  }

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="font-mono text-sm">{product.slug}</span>
              {product.isArchived && <Badge variant="destructive">Archived</Badge>}
              {!product.isArchived && <Badge variant="default">Active</Badge>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant={product.availabilityStatus === 'in_stock' ? "default" : "destructive"}>
            {product.availabilityStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Brand</p>
                  <p>{product.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category ID</p>
                  <p>{product.categoryId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="font-mono">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">GTIN</p>
                  <p className="font-mono">{product.gtin || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MPN</p>
                  <p className="font-mono">{product.mpn || '-'}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </CardContent>
          </Card>

          {/* Details & Attributes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Details & Attributes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ingredients</p>
                  <p className="text-sm">{product.ingredients}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Allergens</p>
                  <p className="text-sm">{product.allergens || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Shelf Life</p>
                  <p className="text-sm">{product.shelfLife}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.isVegetarian ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Vegetarian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.isGlutenFree ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Gluten Free</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.keywords.length > 0 ? (
                      product.keywords.map((keyword: string, i: number) => (
                        <Badge key={i} variant="outline">{keyword}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.length > 0 ? (
                      product.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {product.images.map((img: any, i: number) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {product.images.length === 0 && (
                  <p className="text-sm text-muted-foreground col-span-2 text-center py-4">No images available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-xl font-bold">{formatCurrency(product.price, product.currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MRP</p>
                  <p className="text-muted-foreground line-through">{formatCurrency(product.mrp, product.currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discount</p>
                  <Badge variant="secondary">{product.discountPercent}% OFF</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discount Source</p>
                  <p className="capitalize">{product.discountSource}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Quantity</p>
                  <p>{product.stockQuantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimensions & Weight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Dimensions & Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Length</p>
                  <p>{product.length} cm</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Height</p>
                  <p>{product.height} cm</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Breadth</p>
                  <p>{product.breadth} cm</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weight</p>
                  <p>{product.weight} {product.weightUnit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Package Size</p>
                  <p>{product.packageSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
