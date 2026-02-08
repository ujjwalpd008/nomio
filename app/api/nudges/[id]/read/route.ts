import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify nudge belongs to user
    const nudge = await prisma.nudge.findFirst({
      where: {
        id: params.id,
        OR: [
          { toUserId: payload.userId },
          ...(nomineeIds.length > 0 ? [{ toNomineeId: { in: nomineeIds } }] : []),
        ],
      },
    })

    if (!nudge) {
      return NextResponse.json(
        { error: 'Nudge not found' },
        { status: 404 }
      )
    }

    // Mark as read
    const updated = await prisma.nudge.update({
      where: { id: params.id },
      data: {
        status: 'Read',
        readAt: new Date(),
      },
    })

    return NextResponse.json({ nudge: updated })
  } catch (error) {
    console.error('Mark nudge as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
