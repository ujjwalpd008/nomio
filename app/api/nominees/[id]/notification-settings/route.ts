import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const notificationSettingsSchema = z.object({
  notificationChannels: z.array(z.enum(['Email', 'WhatsApp'])).optional(),
  notificationFrequency: z.enum(['Quarterly', 'HalfYearly', 'Annually']).optional().or(z.literal('')),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nominee = await prisma.nominee.findFirst({
      where: {
        id: params.id,
        nominatedByUserId: payload.userId,
      },
      select: {
        id: true,
        notificationChannels: true,
        notificationFrequency: true,
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      notificationChannels: nominee.notificationChannels || [],
      notificationFrequency: nominee.notificationFrequency || null,
    })
  } catch (error) {
    console.error('Get notification settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const validatedData = notificationSettingsSchema.parse(body)

    // Verify nominee belongs to user
    const nominee = await prisma.nominee.findFirst({
      where: {
        id: params.id,
        nominatedByUserId: payload.userId,
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    // Update notification settings
    const updated = await prisma.nominee.update({
      where: { id: params.id },
      data: {
        notificationChannels: validatedData.notificationChannels || [],
        notificationFrequency: validatedData.notificationFrequency || null,
      },
    })

    return NextResponse.json({
      success: true,
      notificationChannels: updated.notificationChannels,
      notificationFrequency: updated.notificationFrequency,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Update notification settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
