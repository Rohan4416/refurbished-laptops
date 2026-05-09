import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = { ...body }

    // Handle images if it's an array
    if (Array.isArray(body.images)) {
      updateData.images = JSON.stringify(body.images)
    }

    // Convert numeric fields
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.originalPrice !== undefined) updateData.originalPrice = parseFloat(body.originalPrice)
    if (body.stockQuantity !== undefined) updateData.stockQuantity = parseInt(body.stockQuantity)
    if (body.batteryHealth !== undefined) updateData.batteryHealth = parseInt(body.batteryHealth)

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}