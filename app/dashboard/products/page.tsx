'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { useFoods, useAddFood, useUpdateFood, useDeleteFood, Food } from '@/lib/foods/useFoods'
import { Plus, Edit, Trash2, Upload, Star } from 'lucide-react'
import Image from 'next/image'
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
const Markdown = dynamic(() => import('@uiw/react-md-editor').then(mod => ({ default: mod.default.Markdown })), { ssr: false })
import '@uiw/react-md-editor/markdown-editor.css'

export default function ProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: ''
  })

  const { data: foods, isLoading } = useFoods()
  const addFoodMutation = useAddFood()
  const updateFoodMutation = useUpdateFood()
  const deleteFoodMutation = useDeleteFood()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const foodData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price)
      }

      if (selectedFood) {
        // Edit mode
        await updateFoodMutation.mutateAsync({
          id: selectedFood.id || selectedFood._id!,
          data: {
            food: JSON.stringify(foodData),
            file: selectedFile || undefined
          }
        })
        toast.success('Food updated successfully!')
        setIsEditDialogOpen(false)
      } else {
        // Add mode
        await addFoodMutation.mutateAsync({
          food: JSON.stringify(foodData),
          file: selectedFile || undefined
        })
        toast.success('Food added successfully!')
        setIsAddDialogOpen(false)
      }

      setFormData({ name: '', description: '', category: '', price: '' })
      setSelectedFile(null)
      setSelectedFood(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${selectedFood ? 'update' : 'add'} food`)
    }
  }

  const handleEdit = (food: Food) => {
    setSelectedFood(food)
    setFormData({
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price.toString()
    })
    setSelectedFile(null)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (food: Food) => {
    setSelectedFood(food)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedFood) return

    try {
      await deleteFoodMutation.mutateAsync(selectedFood.id || selectedFood._id!)
      toast.success('Food deleted successfully!')
      setIsDeleteDialogOpen(false)
      setSelectedFood(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete food')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', price: '' })
    setSelectedFile(null)
    setSelectedFood(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your food items</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Food</DialogTitle>
              <DialogDescription>
                Add a new food item to your menu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Food name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.description}
                  onChange={(value: string | undefined) => setFormData(prev => ({ ...prev, description: value || '' }))}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: 'Food description (supports markdown)'
                  }}
                  commandsFilter={(command: any, isExtra: boolean) => {
                    // Remove image command to prevent image uploads
                    if (command.name === 'image') return false
                    return command
                  }}
                  height={150}
                />
              </div>
            </div>              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Food category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addFoodMutation.isPending}>
                  {addFoodMutation.isPending ? 'Adding...' : 'Add Food'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Food</DialogTitle>
            <DialogDescription>
              Update the food item details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Food name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.description}
                  onChange={(value: string | undefined) => setFormData(prev => ({ ...prev, description: value || '' }))}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: 'Food description (supports markdown)'
                  }}
                  commandsFilter={(command: any, isExtra: boolean) => {
                    // Remove image command to prevent image uploads
                    if (command.name === 'image') return false
                    return command
                  }}
                  height={150}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                placeholder="Food category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
              )}
              {selectedFood?.imageUrl && !selectedFile && (
                <p className="text-sm text-gray-600">Current image will be kept if no new image is selected</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateFoodMutation.isPending}>
                {updateFoodMutation.isPending ? 'Updating...' : 'Update Food'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedFood?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedFood(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteFoodMutation.isPending}
            >
              {deleteFoodMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods?.map((food, index) => (
            <Card key={food.id || food._id || `food-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-gray-100">
                {food.imageUrl ? (
                  <Image
                    src={food.imageUrl}
                    alt={food.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Upload className="w-8 h-8" />
                  </div>
                )}
                {food.newLaunch && (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    New
                  </Badge>
                )}
                {food.discountPercent && food.discountPercent > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    -{food.discountPercent}%
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{food.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{food.discountedPrice || food.price}
                  </span>
                  {food.discountedPrice && food.discountedPrice < food.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{food.price}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="text-sm text-gray-600 mb-2">
                  <Markdown source={food.description} style={{ background: 'transparent', color: 'inherit' }} />
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  {food.createdAt && (
                    <div>Created: {new Date(food.createdAt).toLocaleDateString()}</div>
                  )}
                  {food.updatedAt && food.updatedAt !== food.createdAt && (
                    <div>Updated: {new Date(food.updatedAt).toLocaleDateString()}</div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {food.category}
                  </Badge>
                  {food.subCategory && (
                    <Badge variant="outline" className="text-xs">
                      {food.subCategory}
                    </Badge>
                  )}
                  {food.flavour && (
                    <Badge variant="outline" className="text-xs">
                      {food.flavour}
                    </Badge>
                  )}
                  {food.dietPreference && (
                    <Badge variant="outline" className="text-xs">
                      {food.dietPreference}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{food.unit}</span>
                  <span>{food.shelfLife}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(food)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(food)}
                    disabled={deleteFoodMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {foods?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Upload className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first food item.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Food
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}