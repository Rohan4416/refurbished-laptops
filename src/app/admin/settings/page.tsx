'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiShoppingBag, FiTruck, FiPercent, FiShare2, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

interface Settings {
  store: {
    name: string
    tagline: string
    email: string
    phone: string
    address: string
  }
  shipping: {
    freeThreshold: number
    standardCost: number
    expressCost: number
  }
  tax: {
    rate: number
  }
  social: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
}

const defaultSettings: Settings = {
  store: {
    name: 'RefurbTech',
    tagline: 'Certified Refurbished Laptops',
    email: 'support@refurbtech.com',
    phone: '+91 9876543210',
    address: '123 Tech Street, Mumbai, Maharashtra, India',
  },
  shipping: {
    freeThreshold: 40000,
    standardCost: 4000,
    expressCost: 8000,
  },
  tax: {
    rate: 18,
  },
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
  },
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [activeTab, setActiveTab] = useState<'store' | 'shipping' | 'tax' | 'social'>('store')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setFetching(true)
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success('Settings saved successfully')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const updateStore = (field: string, value: string) => {
    setSettings({
      ...settings,
      store: { ...settings.store, [field]: value },
    })
  }

  const updateShipping = (field: string, value: number) => {
    setSettings({
      ...settings,
      shipping: { ...settings.shipping, [field]: value },
    })
  }

  const updateTax = (rate: number) => {
    setSettings({
      ...settings,
      tax: { ...settings.tax, rate },
    })
  }

  const updateSocial = (field: string, value: string) => {
    setSettings({
      ...settings,
      social: { ...settings.social, [field]: value },
    })
  }

  const tabs = [
    { id: 'store', label: 'Store Info', icon: FiShoppingBag },
    { id: 'shipping', label: 'Shipping', icon: FiTruck },
    { id: 'tax', label: 'Tax', icon: FiPercent },
    { id: 'social', label: 'Social Links', icon: FiShare2 },
  ]

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your store settings</p>
        </div>
        <Button onClick={handleSave} isLoading={loading}>
          <FiSave className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Store Info Tab */}
      {activeTab === 'store' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Store Name"
              value={settings.store.name}
              onChange={(e) => updateStore('name', e.target.value)}
              placeholder="Enter store name"
            />
            <Input
              label="Tagline"
              value={settings.store.tagline}
              onChange={(e) => updateStore('tagline', e.target.value)}
              placeholder="Enter store tagline"
            />
            <Input
              label="Email"
              type="email"
              value={settings.store.email}
              onChange={(e) => updateStore('email', e.target.value)}
              placeholder="support@example.com"
            />
            <Input
              label="Phone"
              value={settings.store.phone}
              onChange={(e) => updateStore('phone', e.target.value)}
              placeholder="+91 9876543210"
            />
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={settings.store.address}
                onChange={(e) => updateStore('address', e.target.value)}
                placeholder="Enter full address"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Shipping Settings</h2>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                Orders above <span className="font-bold">₹{settings.shipping.freeThreshold.toLocaleString('en-IN')}</span> qualify for free shipping.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Free Shipping Threshold (₹)"
                type="number"
                value={settings.shipping.freeThreshold}
                onChange={(e) => updateShipping('freeThreshold', parseInt(e.target.value) || 0)}
                placeholder="40000"
              />
              <Input
                label="Standard Shipping Cost (₹)"
                type="number"
                value={settings.shipping.standardCost}
                onChange={(e) => updateShipping('standardCost', parseInt(e.target.value) || 0)}
                placeholder="4000"
              />
              <Input
                label="Express Shipping Cost (₹)"
                type="number"
                value={settings.shipping.expressCost}
                onChange={(e) => updateShipping('expressCost', parseInt(e.target.value) || 0)}
                placeholder="8000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tax Tab */}
      {activeTab === 'tax' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Tax Settings</h2>
          <div className="space-y-6">
            <div className="max-w-md">
              <Input
                label="GST Rate (%)"
                type="number"
                value={settings.tax.rate}
                onChange={(e) => updateTax(parseFloat(e.target.value) || 0)}
                placeholder="18"
              />
              <p className="text-sm text-slate-500 mt-2">
                This tax rate will be applied to all orders at checkout.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800">
                Current GST Rate: <span className="font-bold">{settings.tax.rate}%</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Facebook"
              value={settings.social.facebook}
              onChange={(e) => updateSocial('facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
            <Input
              label="Twitter / X"
              value={settings.social.twitter}
              onChange={(e) => updateSocial('twitter', e.target.value)}
              placeholder="https://twitter.com/yourpage"
            />
            <Input
              label="Instagram"
              value={settings.social.instagram}
              onChange={(e) => updateSocial('instagram', e.target.value)}
              placeholder="https://instagram.com/yourpage"
            />
            <Input
              label="LinkedIn"
              value={settings.social.linkedin}
              onChange={(e) => updateSocial('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/yourpage"
            />
          </div>
        </div>
      )}
    </div>
  )
}