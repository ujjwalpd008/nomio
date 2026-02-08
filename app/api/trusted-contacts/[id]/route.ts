import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const trustedContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = trustedContactSchema.parse(body)

    const contact = await prisma.trustedContact.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Trusted contact not found' },
        { status: 404 }
      )
    }

    const updatedContact = await prisma.trustedContact.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
      },
    })

    return NextResponse.json({ contact: updatedContact })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Update trusted contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contact = await prisma.trustedContact.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Trusted contact not found' },
        { status: 404 }
      )
    }

    await prisma.trustedContact.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete trusted contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
