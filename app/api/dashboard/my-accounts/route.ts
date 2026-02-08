import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get accounts owned by the user
    const ownedAccounts = await prisma.account.findMany({
      where: { userId: payload.userId },
      include: {
        accountNominees: {
          include: {
            nominee: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                relationship: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ accounts: ownedAccounts })
  } catch (error) {
    console.error('Get my accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
