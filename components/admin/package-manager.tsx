'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface Package {
  _id: string
  name: string
  popularityAmount: number
  price: number
  description?: string
  isActive: boolean
}

interface PackageManagerProps {
  packages: Package[]
  onUpdate: () => void
}

export default function PackageManager({ packages, onUpdate }: PackageManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    popularityAmount: '',
    price: '',
    description: '',
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      name: '',
      popularityAmount: '',
      price: '',
      description: '',
      isActive: true,
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      popularityAmount: pkg.popularityAmount.toString(),
      price: pkg.price.toString(),
      description: pkg.description || '',
      isActive: pkg.isActive,
    })
    setEditingId(pkg._id)
    setIsAdding(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingId ? '/api/packages' : '/api/packages'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          name: formData.name,
          popularityAmount: parseInt(formData.popularityAmount),
          price: parseFloat(formData.price),
          description: formData.description,
          isActive: formData.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save package')
      }

      resetForm()
      onUpdate()
    } catch (error) {
      console.error('Error saving package:', error)
      alert('Failed to save package')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/packages?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete package')
      }

      onUpdate()
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Failed to delete package')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Packages</h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-pubg-yellow text-pubg-dark hover:bg-pubg-orange"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-pubg-gray bg-pubg-gray/50">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? 'Edit Package' : 'Add New Package'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Package Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Starter Pack"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Popularity Amount</label>
                  <Input
                    type="number"
                    value={formData.popularityAmount}
                    onChange={(e) => setFormData({ ...formData, popularityAmount: e.target.value })}
                    placeholder="e.g., 1000"
                    required
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 9.99"
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Description (Optional)</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-pubg-gray bg-pubg-dark text-pubg-yellow"
                />
                <label htmlFor="isActive" className="text-sm text-gray-400">
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-pubg-yellow text-pubg-dark hover:bg-pubg-orange"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg._id} className="border-pubg-gray bg-pubg-gray/30">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-white">{pkg.name}</h3>
                  <p className="text-sm text-gray-400">
                    {pkg.popularityAmount.toLocaleString()} popularity • {formatPrice(pkg.price)}
                  </p>
                </div>
                <Badge variant={pkg.isActive ? 'completed' : 'cancelled'}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(pkg)}
                  className="text-gray-400 hover:text-pubg-yellow"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(pkg._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
