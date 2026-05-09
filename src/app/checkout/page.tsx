'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowLeft, FiCheck, FiTruck, FiCreditCard } from 'react-icons/fi'
import { useCartStore } from '@/store/cart-store'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

function CheckoutContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  })

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 500 ? 0 : 49
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          paymentMethod: 'Dummy Purchase',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/profile?order=${data.order.orderNumber}`)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to place order')
      }
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FiCreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-600 mb-6">Add some products to checkout</p>
          <Link href="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/shop" className="p-2 hover:bg-slate-100 rounded-lg">
                <FiArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FiCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <FiTruck className="w-5 h-5" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="bg-slate-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-slate-900">Dummy Purchase (No Payment)</span>
                </div>
                <p className="text-sm text-slate-500 mt-2 ml-7">
                  This is a demo checkout. No real payment will be processed.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const images = typeof item.product.images === 'string'
                    ? JSON.parse(item.product.images)
                    : item.product.images
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={images[0] || '/placeholder.jpg'}
                          alt={item.product.model}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.product.brand} {item.product.model}
                        </p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" size="lg" isLoading={loading}>
                Place Order (Dummy)
              </Button>
              <p className="text-xs text-center text-slate-500 mt-4">
                By placing this order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}