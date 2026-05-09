'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import toast from 'react-hot-toast'

const conditionOptions = [
  { value: 'PRISTINE', label: 'Pristine - Like new condition' },
  { value: 'EXCELLENT', label: 'Excellent - Minimal signs of use' },
  { value: 'GOOD', label: 'Good - Light wear, fully functional' },
  { value: 'FAIR', label: 'Fair - Visible wear, great value' },
]

const brandOptions = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Dell', label: 'Dell' },
  { value: 'HP', label: 'HP' },
  { value: 'Lenovo', label: 'Lenovo' },
  { value: 'ASUS', label: 'ASUS' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'Other', label: 'Other' },
]

const processorBrandOptions = [
  { value: 'Intel', label: 'Intel' },
  { value: 'AMD', label: 'AMD' },
  { value: 'Apple', label: 'Apple' },
]

const warrantyOptions = [
  { value: '6 Months', label: '6 Months' },
  { value: '1 Year', label: '1 Year' },
  { value: '2 Years', label: '2 Years' },
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    processor: '',
    processorBrand: 'Intel',
    ram: '',
    storage: '',
    displaySize: '',
    conditionGrade: 'EXCELLENT',
    batteryHealth: '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    warranty: '1 Year',
    description: '',
    images: '',
    featured: false,
    isPublished: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        batteryHealth: parseInt(formData.batteryHealth),
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        stockQuantity: parseInt(formData.stockQuantity),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Product created successfully')
        router.push('/admin/products')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create product')
      }
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-lg">
          <FiArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-slate-600">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-slate-900">Basic Information</h3>

            <Select
              label="Brand"
              options={brandOptions}
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />

            <Input
              label="Model"
              placeholder="e.g., MacBook Pro 14 M3"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Processor Brand"
                options={processorBrandOptions}
                value={formData.processorBrand}
                onChange={(e) => setFormData({ ...formData, processorBrand: e.target.value })}
              />

              <Input
                label="Processor"
                placeholder="e.g., Apple M3 Pro"
                value={formData.processor}
                onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="RAM"
                placeholder="e.g., 16GB"
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                required
              />

              <Input
                label="Storage"
                placeholder="e.g., 512GB SSD"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                required
              />

              <Input
                label="Display"
                placeholder="e.g., 14.2&quot;"
                value={formData.displaySize}
                onChange={(e) => setFormData({ ...formData, displaySize: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Pricing & Condition */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-slate-900">Pricing & Condition</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />

              <Input
                label="Original Price ($)"
                type="number"
                placeholder="0.00"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                required
              />
            </div>

            <Select
              label="Condition Grade"
              options={conditionOptions}
              value={formData.conditionGrade}
              onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Battery Health (%)"
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={formData.batteryHealth}
                onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                required
              />

              <Input
                label="Stock Quantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </div>

            <Select
              label="Warranty"
              options={warrantyOptions}
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
            />

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-700">Published</span>
              </label>
            </div>
          </div>

          {/* Description & Images */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-semibold text-lg text-slate-900">Description & Images</h3>

            <Textarea
              label="Description"
              placeholder="Describe the product, its features, and condition details..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <Input
              label="Image URLs (comma separated)"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              helperText="Enter image URLs separated by commas"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
          <Link href="/admin/products">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={loading}>
            <FiSave className="w-4 h-4 mr-2" />
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}