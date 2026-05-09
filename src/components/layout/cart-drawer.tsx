'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConditionBadge } from '@/components/ui/badge'

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, clearCart } = useCartStore()

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Shopping Cart</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FiShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Your cart is empty</h3>
              <p className="text-slate-500 mb-6">Discover our certified refurbished laptops</p>
              <Button onClick={() => setCartOpen(false)}>
                <Link href="/shop">Browse Laptops</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const images = typeof item.product.images === 'string'
                  ? JSON.parse(item.product.images)
                  : item.product.images

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    {/* Product image */}
                    <Link
                      href={`/shop/${item.product.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="relative w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={images[0] || '/placeholder-laptop.jpg'}
                        alt={item.product.model}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-xs text-slate-400">{item.product.brand}</p>
                          <Link
                            href={`/shop/${item.product.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="text-sm font-medium text-slate-900 hover:text-blue-600 line-clamp-1"
                          >
                            {item.product.model}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <ConditionBadge condition={item.product.conditionGrade as 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'} />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-semibold text-slate-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 p-4 bg-white">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-slate-100">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link href="/checkout" onClick={() => setCartOpen(false)}>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>Secure Checkout</span>
              <span>•</span>
              <span>30-Day Returns</span>
              <span>•</span>
              <span>Verified Quality</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}