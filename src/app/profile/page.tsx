'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiPackage, FiMapPin, FiCreditCard, FiLogOut, FiShoppingBag } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
  items: { quantity: number; price: number; product: { brand: string; model: string; images: string } }[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PROCESSING: 'bg-amber-100 text-amber-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      SHIPPED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-emerald-100 text-emerald-700',
      CANCELLED: 'bg-red-100 text-red-700',
      RETURNED: 'bg-stone-100 text-stone-700',
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{(session.user as {name?: string})?.name || 'User'}</h1>
              <p className="text-slate-600">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FiPackage className="w-5 h-5" />
                  <span className="font-medium">My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">Account Settings</span>
                </button>
                <Link
                  href="/shop"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Continue Shopping</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order History</h2>
                {loading ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
                    <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
                    <Link href="/shop">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                            <span className="font-semibold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                              <Image
                                src={JSON.parse(item.product.images)[0] || '/placeholder.jpg'}
                                alt={item.product.model}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-sm text-slate-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Account Settings</h2>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        defaultValue={(session.user as {name?: string})?.name || ''}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
                      <input
                        type="email"
                        defaultValue={session.user?.email || ''}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50"
                        disabled
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}