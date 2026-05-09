import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi'
import Link from 'next/link'

async function getStats() {
  const [recentOrders, totalUsers, lowStockProducts] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.user.count(),
    prisma.product.findMany({
      where: { stockQuantity: { lt: 3 }, isPublished: true },
      select: { id: true, brand: true, model: true, stockQuantity: true },
      take: 5,
    }),
  ])

  const [productsCount, totalRevenueAgg] = await Promise.all([
    prisma.product.count({ where: { isPublished: true } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ])

  const totalRevenue = totalRevenueAgg._sum.totalAmount || 0

  return {
    totalProducts: productsCount,
    totalOrders: recentOrders.length,
    totalUsers,
    totalRevenue,
    recentOrders,
    lowStockProducts,
    lowStockCount: lowStockProducts.length,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/auth/login?callbackUrl=/admin')
  }

  const stats = await getStats()

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingCart, color: 'bg-emerald-500' },
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {(session.user as {name?: string})?.name || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <FiTrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No orders yet</div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{order.orderNumber}</p>
                    <p className="text-sm text-slate-500">{order.user.name || order.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">${order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                      order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.orderStatus === 'PROCESSING' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Low Stock Alert</h2>
              {stats.lowStockCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {stats.lowStockCount}
                </span>
              )}
            </div>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700">
              Manage Products →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-slate-500">All products are well stocked</div>
            ) : (
              stats.lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-slate-900">{product.brand} {product.model}</p>
                      <p className="text-sm text-slate-500">SKU: {product.id.slice(-8)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.stockQuantity === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {product.stockQuantity === 0 ? 'Out of Stock' : `${product.stockQuantity} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
          >
            <FiPackage className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Add New Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
          >
            <FiShoppingCart className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Process Orders</span>
          </Link>
          <Link
            href="/admin/products"
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
          >
            <FiTrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">Update Inventory</span>
          </Link>
          <Link
            href="/shop"
            target="_blank"
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
          >
            <FiUsers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-slate-700">View Store</span>
          </Link>
        </div>
      </div>
    </div>
  )
}