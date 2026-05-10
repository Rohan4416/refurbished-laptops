import { ConditionGrade, OrderStatus, PaymentStatus, Role } from '@prisma/client'

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: Role
  emailVerified: Date | null
  createdAt: Date
}

export interface Address {
  id: string
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

export interface Product {
  id: string
  brand: string
  model: string
  slug: string
  processor: string
  ram: string
  storage: string
  displaySize: string
  conditionGrade: ConditionGrade
  batteryHealth: number
  price: number
  originalPrice: number
  stockQuantity: number
  images: string[] | string
  description: string
  warranty: string
  processorBrand: string
  isPublished: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  totalAmount: number
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  trackingNumber: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: Date
}

export interface FilterOptions {
  brands?: string[]
  processors?: string[]
  ram?: string[]
  storage?: string[]
  priceMin?: number
  priceMax?: number
  conditionGrades?: ConditionGrade[]
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ProductFilters {
  search?: string
  brands?: string[]
  processorBrands?: string[]
  ram?: string[]
  storage?: string[]
  conditionGrades?: ConditionGrade[]
  priceMin?: number
  priceMax?: number
  featured?: boolean
  sortBy?: string
  page?: number
  limit?: number
}