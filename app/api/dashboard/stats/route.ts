import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [nomineeCount, accountCount, totalValue, documentCount, trustedContactCount] = await Promise.all([
      prisma.nominee.count({ where: { nominatedByUserId: payload.userId } }),
      prisma.account.count({ where: { userId: payload.userId } }),
      prisma.account.aggregate({
        where: {
          userId: payload.userId,
          approximateValue: { not: null },
        },
        _sum: { approximateValue: true },
      }),
      prisma.document.count({ where: { userId: payload.userId } }),
      prisma.trustedContact.count({ where: { userId: payload.userId } }),
    ])

    return NextResponse.json({
      stats: {
        nomineeCount,
        accountCount,
        totalValue: totalValue._sum.approximateValue || 0,
        documentCount,
        trustedContactCount,
      },
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
