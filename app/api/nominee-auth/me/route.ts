import { NextResponse } from 'next/server'
import { getCurrentNominee } from '@/lib/nominee-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payload = await getCurrentNominee()

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const nominee = await prisma.nominee.findUnique({
      where: { id: payload.nomineeId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        relationship: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ nominee })
  } catch (error) {
    console.error('Get nominee error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
