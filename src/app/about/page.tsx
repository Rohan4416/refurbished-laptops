import Link from 'next/link'
import { FiCheck, FiAward, FiGlobe, FiHeart } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About RefurbTech
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              We're on a mission to make premium technology accessible while reducing electronic waste. Every laptop we sell undergoes rigorous testing to ensure quality and performance.
            </p>
            <Link href="/shop">
              <Button size="lg">
                Browse Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 mb-4">
                Founded in 2020, RefurbTech began with a simple idea: premium laptops shouldn't come with premium prices. We saw an opportunity to bridge the gap between affordable computing and sustainable technology.
              </p>
              <p className="text-slate-600 mb-4">
                Our team of certified technicians inspects every device through a comprehensive 30-point quality checklist. We replace worn components, update software, and ensure each laptop performs like new before it reaches your desk.
              </p>
              <p className="text-slate-600">
                By choosing refurbished, you're not just saving money—you're also reducing e-waste and contributing to a more sustainable future. Every laptop we refurbish is one less device ending up in landfills.
              </p>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-blue-600">15K+</p>
                  <p className="text-slate-600 mt-1">Laptops Refurbished</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-600">98%</p>
                  <p className="text-slate-600 mt-1">Customer Satisfaction</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-600">50%</p>
                  <p className="text-slate-600 mt-1">Avg. Savings</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-600">12T</p>
                  <p className="text-slate-600 mt-1">E-Waste Prevented (tons)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Refurbishment Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every laptop goes through our comprehensive 30-point inspection and refurbishment process.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Sourcing',
                desc: 'We source devices from corporate upgrades, lease returns, and trade-ins.',
              },
              {
                step: '2',
                title: 'Diagnostics',
                desc: 'Complete hardware and software diagnostics to identify all issues.',
              },
              {
                step: '3',
                title: 'Restoration',
                desc: 'We replace worn parts, clean, update BIOS, and install fresh OS.',
              },
              {
                step: '4',
                title: 'Certification',
                desc: 'Final testing and quality check before grading and listing.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Quality Guaranteed</h3>
                <p className="text-slate-600 text-sm">Every device passes our 30-point inspection</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiGlobe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Sustainability</h3>
                <p className="text-slate-600 text-sm">Reducing e-waste through responsible refurbishment</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiAward className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Expert Support</h3>
                <p className="text-slate-600 text-sm">Lifetime technical assistance with every purchase</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiHeart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Customer First</h3>
                <p className="text-slate-600 text-sm">30-day returns and dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Laptop?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Browse our full collection and save up to 50% on premium devices.
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}