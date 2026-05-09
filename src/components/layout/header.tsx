'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { FiShoppingCart, FiSearch, FiUser, FiMenu, FiX, FiChevronDown, FiLogOut, FiSettings } from 'react-icons/fi'
import { useCartStore } from '@/store/cart-store'
import { cn } from '@/lib/utils'

const categories = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Dell', slug: 'dell' },
  { name: 'HP', slug: 'hp' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Other Brands', slug: 'brands' },
]

const conditionGrades = [
  { name: 'Pristine', slug: 'pristine', desc: 'Like new condition' },
  { name: 'Excellent', slug: 'excellent', desc: 'Minimal signs of use' },
  { name: 'Good', slug: 'good', desc: 'Light wear, fully functional' },
  { name: 'Fair', slug: 'fair', desc: 'Visible wear, great value' },
]

export function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const { items, toggleCart } = useCartStore()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const isLoggedIn = !!session?.user

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-slate-500 border-b border-slate-100">
          <p>Free shipping on orders over $500 | 30-day returns</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <span>|</span>
            <Link href="/warranty" className="hover:text-blue-600 transition-colors">Warranty Info</Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900">RefurbTech</span>
              <span className="hidden sm:block text-xs text-slate-500">Certified Refurbished Laptops</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search laptops by brand, model, or specs..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Categories dropdown */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
              >
                Categories
                <FiChevronDown className={cn('w-4 h-4 transition-transform', isCategoryOpen && 'rotate-180')} />
              </button>

              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 animate-fade-in">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?brand=${cat.slug}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 my-2" />
                    <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase">By Condition</p>
                    {conditionGrades.map((grade) => (
                      <Link
                        key={grade.slug}
                        href={`/shop?condition=${grade.slug}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        {grade.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-2 p-2 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Account"
              >
                <FiUser className="w-5 h-5" />
                {isLoggedIn && (
                  <span className="hidden sm:inline text-sm font-medium">
                    {(session.user as {name?: string})?.name?.split(' ')[0] || 'Account'}
                  </span>
                )}
              </button>

              {isAccountOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsAccountOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 animate-fade-in">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="font-medium text-slate-900">{(session.user as {name?: string})?.name || 'User'}</p>
                          <p className="text-sm text-slate-500 truncate">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FiUser className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FiSettings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="border-t border-slate-100 my-2" />
                        <button
                          onClick={() => {
                            setIsAccountOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="px-4 py-2 text-sm text-slate-500">
                          Welcome! Please sign in to continue.
                        </p>
                        <div className="border-t border-slate-100 my-2" />
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FiUser className="w-4 h-4" />
                          Sign In
                        </Link>
                        <Link
                          href="/auth/register"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="Shopping cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search laptops..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase px-4">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?brand=${cat.slug}`}
                className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-3 pt-3">
              <p className="text-xs font-semibold text-slate-400 uppercase px-4">By Condition</p>
              {conditionGrades.map((grade) => (
                <Link
                  key={grade.slug}
                  href={`/shop?condition=${grade.slug}`}
                  className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {grade.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-slate-50 rounded-lg">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-slate-50 rounded-lg">
                    Create Account
                  </Link>
                </>
              )}
              <Link href="/about" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                About Us
              </Link>
              <Link href="/warranty" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                Warranty Info
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}