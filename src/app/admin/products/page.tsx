'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Product {
  id: string
  brand: string
  model: string
  slug: string
  processor: string
  ram: string
  storage: string
  conditionGrade: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'
  price: number
  originalPrice: number
  stockQuantity: number
  featured: boolean
  isPublished: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [page, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })
      if (res.ok) {
        toast.success(`Product ${currentStatus ? 'unpublished' : 'published'} successfully`)
        fetchProducts()
      }
    } catch (error) {
      toast.error('Failed to update product')
    }
  }

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, 'pristine' | 'excellent' | 'good' | 'fair'> = {
      PRISTINE: 'pristine',
      EXCELLENT: 'excellent',
      GOOD: 'good',
      FAIR: 'fair',
    }
    return variants[condition] || 'default'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600">Manage your laptop inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Condition</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{product.brand} {product.model}</p>
                        <p className="text-sm text-slate-500">{product.processor} • {product.ram} • {product.storage}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getConditionBadge(product.conditionGrade)} size="sm">
                        {product.conditionGrade}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">${product.price}</p>
                      <p className="text-sm text-slate-400 line-through">${product.originalPrice}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        product.stockQuantity === 0
                          ? 'bg-red-100 text-red-700'
                          : product.stockQuantity < 5
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {product.stockQuantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(product.id, product.isPublished)}
                        className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer ${
                          product.isPublished
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {product.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/shop/${product.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <FiChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <FiChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}