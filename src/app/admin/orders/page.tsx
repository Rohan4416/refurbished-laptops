'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
  user: { name: string | null; email: string }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [page])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders?page=${page}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      })
      if (res.ok) {
        toast.success('Order status updated')
        fetchOrders()
      }
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PROCESSING: 'bg-amber-100 text-amber-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      SHIPPED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-emerald-100 text-emerald-700',
      CANCELLED: 'bg-red-100 text-red-700',
      RETURNED: 'bg-stone-100 text-stone-700',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-700',
      PAID: 'bg-emerald-100 text-emerald-700',
      FAILED: 'bg-red-100 text-red-700',
      REFUNDED: 'bg-blue-100 text-blue-700',
    }
    return styles[status] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-600">Manage and track customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Order</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Payment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Order Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.orderNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.user.name || 'N/A'}</p>
                      <p className="text-sm text-slate-500">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">${order.totalAmount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getPaymentBadge(order.paymentStatus)} size="sm">
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-3 py-1 text-sm font-medium rounded-full border-0 cursor-pointer ${getStatusBadge(order.orderStatus)}`}
                      >
                        <option value="PROCESSING">Processing</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RETURNED">Returned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <FiEye className="w-4 h-4" />
                      </button>
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