import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type ConditionGrade = 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'

export async function GET(request: Request) {
  try {
    const prisma = await createPrismaClient()

    const { searchParams } = new URL(request.url)

    const brands = searchParams.get('brands')?.split(',').filter(Boolean)
    const conditions = searchParams.get('conditions')?.split(',').filter(Boolean) as ConditionGrade[] | undefined
    const ram = searchParams.get('ram')?.split(',').filter(Boolean)
    const storage = searchParams.get('storage')?.split(',').filter(Boolean)
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured') === 'true'

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isPublished: true,
      stockQuantity: { gt: 0 },
    }

    if (brands?.length) {
      where.brand = { in: brands }
    }

    if (conditions?.length) {
      where.conditionGrade = { in: conditions }
    }

    if (ram?.length) {
      where.ram = { in: ram }
    }

    if (storage?.length) {
      where.storage = { in: storage }
    }

    if (priceMin && priceMax) {
      where.price = { gte: parseFloat(priceMin), lte: parseFloat(priceMax) }
    } else if (priceMin) {
      where.price = { gte: parseFloat(priceMin) }
    } else if (priceMax) {
      where.price = { lte: parseFloat(priceMax) }
    }

    if (search) {
      where.OR = [
        { brand: { contains: search } },
        { model: { contains: search } },
        { processor: { contains: search } },
      ]
    }

    if (featured) {
      where.featured = true
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { stockQuantity: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    })

    // Parse images JSON
    const parsedProducts = products.map((p: typeof products[0]) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    }))

    return NextResponse.json({ products: parsedProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}