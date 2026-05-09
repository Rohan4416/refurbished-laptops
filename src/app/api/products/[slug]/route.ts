import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const parsedProduct = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    }

    return NextResponse.json({ product: parsedProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}