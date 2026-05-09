import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiShield, FiRefreshCw, FiTruck } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Trust badges */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <FiShield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Certified Quality</p>
                <p className="text-xs text-slate-400">30-point inspection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <FiRefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">30-Day Returns</p>
                <p className="text-xs text-slate-400">Money-back guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <FiTruck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Free Shipping</p>
                <p className="text-xs text-slate-400">On orders over $500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <FiPhone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Expert Support</p>
                <p className="text-xs text-slate-400">Lifetime technical help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Laptops</Link></li>
              <li><Link href="/shop?brand=apple" className="hover:text-white transition-colors">Apple</Link></li>
              <li><Link href="/shop?brand=dell" className="hover:text-white transition-colors">Dell</Link></li>
              <li><Link href="/shop?brand=lenovo" className="hover:text-white transition-colors">Lenovo</Link></li>
              <li><Link href="/shop?featured=true" className="hover:text-white transition-colors">Featured Deals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>123 Tech Street<br />San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:support@refurbtech.com" className="hover:text-white transition-colors">
                  support@refurbtech.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">RefurbTech</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>© 2025 RefurbTech. All rights reserved.</span>
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-6 bg-slate-800 rounded text-xs font-bold text-white">
              VISA
            </div>
            <div className="flex items-center justify-center w-10 h-6 bg-slate-800 rounded text-xs font-bold text-white">
              MC
            </div>
            <div className="flex items-center justify-center w-10 h-6 bg-slate-800 rounded text-xs font-bold text-white">
              AMEX
            </div>
            <div className="flex items-center justify-center w-10 h-6 bg-slate-800 rounded text-xs font-bold text-white">
              PP
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}