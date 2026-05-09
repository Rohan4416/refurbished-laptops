'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { ConditionBadge } from '@/components/ui/badge'

const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft', 'Other']
const ramOptions = ['8GB', '16GB', '32GB', '64GB']
const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD']
const conditions = [
  { value: 'PRISTINE', label: 'Pristine', desc: 'Like new' },
  { value: 'EXCELLENT', label: 'Excellent', desc: 'Minimal wear' },
  { value: 'GOOD', label: 'Good', desc: 'Light wear' },
  { value: 'FAIR', label: 'Fair', desc: 'Visible wear' },
]
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    condition: true,
    specs: true,
    price: true,
  })

  const [filters, setFilters] = useState({
    brands: searchParams.get('brand')?.split(',').filter(Boolean) || [],
    conditions: searchParams.get('condition')?.split(',').filter(Boolean) || [],
    ram: [] as string[],
    storage: [] as string[],
    priceMin: '',
    priceMax: '',
    search: '',
    sort: 'newest',
  })

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.brands.length) params.set('brands', filters.brands.join(','))
        if (filters.conditions.length) params.set('conditions', filters.conditions.join(','))
        if (filters.ram.length) params.set('ram', filters.ram.join(','))
        if (filters.storage.length) params.set('storage', filters.storage.join(','))
        if (filters.priceMin) params.set('priceMin', filters.priceMin)
        if (filters.priceMax) params.set('priceMax', filters.priceMax)
        if (filters.search) params.set('search', filters.search)
        params.set('sort', filters.sort)
        params.set('featured', searchParams.get('featured') || '')

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams, filters])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleFilter = (type: string, value: string) => {
    setFilters((prev) => {
      const key = type as keyof typeof prev
      const arr = prev[key] as string[]
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v) => v !== value) }
      }
      return { ...prev, [key]: [...arr, value] }
    })
  }

  const clearFilters = () => {
    setFilters({
      brands: [],
      conditions: [],
      ram: [],
      storage: [],
      priceMin: '',
      priceMax: '',
      search: '',
      sort: 'newest',
    })
  }

  const activeFilterCount = [
    filters.brands.length,
    filters.conditions.length,
    filters.ram.length,
    filters.storage.length,
    filters.priceMin ? 1 : 0,
    filters.priceMax ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="flex gap-8">
      <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 flex-shrink-0`}>
        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900">Filters</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                Clear all
              </button>
            )}
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search laptops..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <div className="border-b border-slate-100 pb-4 mb-4">
            <button
              onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full font-medium text-slate-900 mb-3"
            >
              Brand
              {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.brand && (
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleFilter('brands', brand)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-slate-100 pb-4 mb-4">
            <button
              onClick={() => toggleSection('condition')}
              className="flex items-center justify-between w-full font-medium text-slate-900 mb-3"
            >
              Condition
              {expandedSections.condition ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.condition && (
              <div className="space-y-2">
                {conditions.map((cond) => (
                  <label key={cond.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.conditions.includes(cond.value)}
                      onChange={() => toggleFilter('conditions', cond.value)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{cond.label}</span>
                    <span className="text-xs text-slate-400">({cond.desc})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-slate-100 pb-4 mb-4">
            <button
              onClick={() => toggleSection('specs')}
              className="flex items-center justify-between w-full font-medium text-slate-900 mb-3"
            >
              Specifications
              {expandedSections.specs ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.specs && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">RAM</p>
                  <div className="flex flex-wrap gap-2">
                    {ramOptions.map((ram) => (
                      <button
                        key={ram}
                        onClick={() => toggleFilter('ram', ram)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          filters.ram.includes(ram)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {ram}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Storage</p>
                  <div className="flex flex-wrap gap-2">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => toggleFilter('storage', storage)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          filters.storage.includes(storage)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full font-medium text-slate-900 mb-3"
            >
              Price Range
              {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedSections.price && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                  className="w-full"
                />
                <span className="text-slate-400">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <FiFilter />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-sm text-slate-600">
              {loading ? 'Loading...' : `${products.length} laptops found`}
            </p>
          </div>
          <Select
            options={sortOptions}
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
            className="w-48"
          />
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.brands.map((brand) => (
              <button
                key={brand}
                onClick={() => toggleFilter('brands', brand)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {brand}
                <FiX className="w-4 h-4" />
              </button>
            ))}
            {filters.conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => toggleFilter('conditions', cond)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                <ConditionBadge condition={cond as 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'} size="sm" />
                <FiX className="w-4 h-4" />
              </button>
            ))}
            {filters.ram.map((ram) => (
              <button
                key={ram}
                onClick={() => toggleFilter('ram', ram)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {ram}
                <FiX className="w-4 h-4" />
              </button>
            ))}
            {(filters.priceMin || filters.priceMax) && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, priceMin: '', priceMax: '' }))}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                ${filters.priceMin || '0'} - ${filters.priceMax || '∞'}
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton count={6} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Shop Laptops</h1>
          <p className="text-slate-600 mt-2">Browse our certified refurbished collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton count={6} />
          </div>
        }>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  )
}