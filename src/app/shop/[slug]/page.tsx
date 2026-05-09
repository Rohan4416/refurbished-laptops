'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiCheck, FiShield, FiRefreshCw, FiTruck, FiHeart, FiMinus, FiPlus } from 'react-icons/fi'
import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/button'
import { ConditionBadge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Product {
  id: string
  brand: string
  model: string
  slug: string
  processor: string
  ram: string
  storage: string
  displaySize: string
  conditionGrade: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'
  batteryHealth: number
  price: number
  originalPrice: number
  stockQuantity: number
  images: string[]
  description: string
  warranty: string
  processorBrand: string
  featured: boolean
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data.product)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product as any, quantity)
    toast.success(`${product.brand} ${product.model} added to cart!`)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const savings = product.originalPrice - product.price
  const savingsPercent = Math.round((savings / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-700">Home</Link>
            <span className="text-slate-400">/</span>
            <Link href="/shop" className="text-slate-500 hover:text-slate-700">Shop</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">{product.brand} {product.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/placeholder-laptop.jpg'}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-cover"
              />
              {savingsPercent >= 15 && (
                <span className="absolute top-4 left-4 bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {savingsPercent}% OFF
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-blue-500' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.model}</h1>
              <div className="flex items-center gap-3">
                <ConditionBadge condition={product.conditionGrade} />
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <FiCheck className="w-4 h-4 text-emerald-500" />
                  {product.batteryHealth}% Battery Health
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-slate-900">${product.price}</span>
                <span className="text-xl text-slate-400 line-through">${product.originalPrice}</span>
              </div>
              <p className="text-emerald-600 font-medium">You save ${savings.toFixed(2)} ({savingsPercent}% off)</p>
            </div>

            {/* Specs */}
            <div className="border-t border-b border-slate-200 py-6">
              <h3 className="font-semibold text-slate-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Processor</span>
                  <p className="font-medium text-slate-900">{product.processor}</p>
                </div>
                <div>
                  <span className="text-slate-500">RAM</span>
                  <p className="font-medium text-slate-900">{product.ram}</p>
                </div>
                <div>
                  <span className="text-slate-500">Storage</span>
                  <p className="font-medium text-slate-900">{product.storage}</p>
                </div>
                <div>
                  <span className="text-slate-500">Display</span>
                  <p className="font-medium text-slate-900">{product.displaySize}</p>
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
              <FiShield className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-800">{product.warranty} Warranty</p>
                <p className="text-sm text-emerald-700">Covers hardware defects and malfunctions</p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="p-2 hover:bg-slate-100 transition-colors"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-500">{product.stockQuantity} in stock</span>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" onClick={handleWishlist}>
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <FiTruck className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <FiRefreshCw className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-600">30-Day Returns</p>
              </div>
              <div className="text-center">
                <FiShield className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-600">Certified Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Description</h2>
          <p className="text-slate-600 leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  )
}