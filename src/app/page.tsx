import Link from 'next/link'
import Image from 'next/image'
import { FiShield, FiRefreshCw, FiTruck, FiHeadphones, FiCheck } from 'react-icons/fi'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Product } from '@prisma/client'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true, isPublished: true, stockQuantity: { gt: 0 } },
    take: 4,
  })
  return products
}

async function getLatestProducts() {
  const products = await prisma.product.findMany({
    where: { isPublished: true, stockQuantity: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })
  return products
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const latestProducts = await getLatestProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI2di0yaDEweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Certified Refurbished
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Premium Laptops
                <span className="block text-blue-400">At Half the Price</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-lg">
                Every laptop is professionally inspected, certified, and backed by our comprehensive warranty. Save up to 50% while getting peak performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="text-base">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="text-base border-white text-gray-600 hover:bg-white/10 hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-emerald-400" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-emerald-400" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-emerald-400" />
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-3xl" />
              <Image
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
                alt="MacBook Pro"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white py-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiShield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">30-Point Inspection</p>
                <p className="text-sm text-slate-500">Rigorous quality checks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FiRefreshCw className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">30-Day Returns</p>
                <p className="text-sm text-slate-500">Money-back guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FiTruck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Free Shipping</p>
                <p className="text-sm text-slate-500">On orders over ₹40,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiHeadphones className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Lifetime Support</p>
                <p className="text-sm text-slate-500">Expert tech help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Deals</h2>
              <p className="text-slate-600 mt-2">Top-rated laptops at the best prices</p>
            </div>
            <Link href="/shop?featured=true" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Condition Grades */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Our Grading System
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every laptop is graded based on cosmetic condition and tested for performance. Choose the grade that fits your needs and budget.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { grade: 'Pristine', desc: 'Like new condition', color: 'bg-emerald-500', savings: '20-30% off' },
              { grade: 'Excellent', desc: 'Minimal signs of use', color: 'bg-emerald-400', savings: '25-40% off' },
              { grade: 'Good', desc: 'Light wear, fully functional', color: 'bg-amber-500', savings: '35-50% off' },
              { grade: 'Fair', desc: 'Visible wear, great value', color: 'bg-stone-500', savings: '40-60% off' },
            ].map((item) => (
              <Link
                key={item.grade}
                href={`/shop?condition=${item.grade.toLowerCase()}`}
                className="group p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className={`w-4 h-4 rounded-full ${item.color} mb-4`} />
                <h3 className="font-semibold text-lg text-slate-900 mb-1 group-hover:text-blue-600">
                  {item.grade}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{item.desc}</p>
                <p className="text-sm font-medium text-blue-600">{item.savings}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Latest Arrivals</h2>
              <p className="text-slate-600 mt-2">Just added to our inventory</p>
            </div>
            <Link href="/shop?sort=newest" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Laptop?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our full collection of certified refurbished laptops. Every purchase is backed by our 30-day money-back guarantee.
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary" className="text-base">
              Browse All Laptops
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}