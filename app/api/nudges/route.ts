import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const nudgeSchema = z.object({
  nomineeId: z.string(),
  message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = nudgeSchema.parse(body)

    // Verify nominee belongs to the user
    const nominee = await prisma.nominee.findFirst({
      where: {
        id: validatedData.nomineeId,
        nominatedByUserId: payload.userId,
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    // Create nudge
    const nudge = await prisma.nudge.create({
      data: {
        fromUserId: payload.userId,
        toNomineeId: nominee.id,
        toUserId: nominee.userId || null, // Link to user if they've signed up
        message: validatedData.message,
      },
      include: {
        fromUser: {
          select: {
            name: true,
            email: true,
          },
        },
        toNominee: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json({ nudge }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create nudge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find nominee records linked to this user
    const userNominees = await prisma.nominee.findMany({
      where: { userId: payload.userId },
      select: { id: true },
    })
    const nomineeIds = userNominees.map(n => n.id)

    // Get nudges received by the user
    const nudges = await prisma.nudge.findMany({
      where: {
        OR: [
          { toUserId: payload.userId },
          ...(nomineeIds.length > 0 ? [{ toNomineeId: { in: nomineeIds } }] : []),
        ],
      },
      include: {
        fromUser: {
          select: {
            name: true,
            email: true,
          },
        },
        toNominee: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Also get nudges sent by the user
    const sentNudges = await prisma.nudge.findMany({
      where: {
        fromUserId: payload.userId,
      },
      include: {
        toUser: {
          select: {
            name: true,
            email: true,
          },
        },
        toNominee: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const unreadCount = nudges.filter(n => n.status === 'Unread').length

    return NextResponse.json({
      received: nudges,
      sent: sentNudges,
      unreadCount,
    })
  } catch (error) {
    console.error('Get nudges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
