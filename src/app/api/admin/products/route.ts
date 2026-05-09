import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const search = searchParams.get('search')

    const where: any = {}
    if (search) {
      where.OR = [
        { brand: { contains: search } },
        { model: { contains: search } },
      ]
    }

    const [products, total] = await Promise.all([
      (await createPrismaClient()).product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (await createPrismaClient()).product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      brand, model, processor, ram, storage, displaySize,
      conditionGrade, batteryHealth, price, originalPrice,
      stockQuantity, images, description, warranty,
      processorBrand, featured, isPublished
    } = body

    // Generate slug
    const slug = `${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    const product = await (await createPrismaClient()).product.create({
      data: {
        brand,
        model,
        slug,
        processor,
        ram,
        storage,
        displaySize,
        conditionGrade,
        batteryHealth,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        stockQuantity: parseInt(stockQuantity),
        images: JSON.stringify(images || []),
        description,
        warranty,
        processorBrand,
        featured: featured || false,
        isPublished: isPublished !== false,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}