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

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nominees = await prisma.nominee.findMany({
      where: { nominatedByUserId: payload.userId },
      select: {
        id: true,
        fullName: true,
        relationship: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        panNumber: true,
        address: true,
        userId: true, // User account if linked
        notificationChannels: true,
        notificationFrequency: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ nominees })
  } catch (error) {
    console.error('Get nominees error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = nomineeSchema.parse(body)

    // Check if nominee already exists as a User (by email or phone)
    let linkedUserId = null
    if (validatedData.email || validatedData.phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(validatedData.email ? [{ email: validatedData.email }] : []),
            ...(validatedData.phone ? [{ phone: validatedData.phone }] : []),
          ],
        },
      })
      if (existingUser) {
        linkedUserId = existingUser.id
      }
    }

    const nominee = await prisma.nominee.create({
      data: {
        nominatedByUserId: payload.userId,
        userId: linkedUserId,
        fullName: validatedData.fullName,
        relationship: validatedData.relationship,
        email: validatedData.email || null,
        phone: validatedData.phone,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        panNumber: validatedData.panNumber || null,
        address: validatedData.address || null,
      },
    })

    return NextResponse.json({ nominee }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create nominee error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
