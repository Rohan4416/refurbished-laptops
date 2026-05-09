'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi'
import { Product } from '@/types'
import { formatPrice, calculateSavingsPercentage } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { ConditionBadge } from '@/components/ui/badge'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()

  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
  const savings = calculateSavingsPercentage(product.originalPrice, product.price)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`${product.brand} ${product.model} added to cart!`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const isOutOfStock = product.stockQuantity === 0

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-slate-300">
        {/* Image container */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <Image
            src={images[0] || '/placeholder-laptop.jpg'}
            alt={`${product.brand} ${product.model}`}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {savings >= 20 && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                {savings}% OFF
              </span>
            )}
            {product.featured && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                FEATURED
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick add to cart overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
              isHovered && !isOutOfStock ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <FiShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand & Model */}
          <div className="mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {product.brand}
            </p>
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.model}
            </h3>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {product.processor}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {product.ram}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {product.storage}
            </span>
          </div>

          {/* Condition & Battery */}
          <div className="flex items-center gap-3 mb-3">
            <ConditionBadge condition={product.conditionGrade as 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'} />
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <FiCheck className="w-4 h-4 text-emerald-500" />
              <span>{product.batteryHealth}% Battery</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice > product.price && (
                <p className="text-sm text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
            {product.warranty && (
              <span className="text-xs text-emerald-600 font-medium">
                {product.warranty} Warranty
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface ProductCardSkeletonProps {
  count?: number
}

export function ProductCardSkeleton({ count = 1 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-slate-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-6 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}