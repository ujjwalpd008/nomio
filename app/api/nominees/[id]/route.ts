import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const nomineeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  relationship: z.enum(['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other']),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number is required'),
  dateOfBirth: z.string().optional(),
  panNumber: z.string().optional(),
  address: z.string().optional(),
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
    const validatedData = nomineeSchema.parse(body)

    // Check if nominee belongs to user
    const existingNominee = await prisma.nominee.findFirst({
      where: {
        id: params.id,
        nominatedByUserId: payload.userId,
      },
    })

    if (!existingNominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    const nominee = await prisma.nominee.update({
      where: { id: params.id },
      data: {
        fullName: validatedData.fullName,
        relationship: validatedData.relationship,
        email: validatedData.email || null,
        phone: validatedData.phone,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        panNumber: validatedData.panNumber || null,
        address: validatedData.address || null,
      },
    })

    return NextResponse.json({ nominee })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Update nominee error:', error)
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

    // Check if nominee belongs to user and is not linked to any accounts
    const nominee = await prisma.nominee.findFirst({
      where: {
        id: params.id,
        nominatedByUserId: payload.userId,
      },
      include: {
        accountNominees: true,
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    if (nominee.accountNominees.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete nominee linked to accounts. Remove from accounts first.' },
        { status: 400 }
      )
    }

    await prisma.nominee.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete nominee error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
