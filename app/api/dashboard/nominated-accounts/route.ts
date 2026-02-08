import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Debug: Log the userId we're searching for
    console.log('🔍 Searching for nominated accounts for userId:', payload.userId)

    // Get accounts where user is nominated (via User link)
    const nominatedAccounts = await prisma.accountNominee.findMany({
      where: { userId: payload.userId },
      include: {
        account: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            accountNominees: {
              include: {
                nominee: {
                  select: {
                    id: true,
                    fullName: true,
                    relationship: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            documents: {
              where: {
                isCritical: true,
              },
            },
          },
        },
      },
      orderBy: {
        account: {
          createdAt: 'desc',
        },
      },
    })

    // Debug: Log what we found
    console.log(`📊 Found ${nominatedAccounts.length} nominated accounts for user ${payload.userId}`)
    if (nominatedAccounts.length > 0) {
      console.log('Accounts:', nominatedAccounts.map(an => ({
        accountId: an.accountId,
        institutionName: an.account?.institutionName,
        allocation: an.allocationPercentage
      })))
    }

    // Format response
    const accounts = nominatedAccounts.map((an) => ({
      id: an.account.id,
      accountType: an.account.accountType,
      institutionName: an.account.institutionName,
      accountNumber: an.account.accountNumber,
      approximateValue: an.account.approximateValue,
      status: an.account.status,
      notes: an.account.notes,
      allocationPercentage: an.allocationPercentage,
      accountOwner: an.account.user,
      allNominees: an.account.accountNominees.map((n) => ({
        id: n.nominee?.id || n.user?.id,
        name: n.nominee?.fullName || n.user?.name,
        relationship: n.nominee?.relationship || null,
        allocationPercentage: n.allocationPercentage,
        isUser: !!n.user,
      })),
      criticalDocuments: an.account.documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        fileName: doc.fileName,
        filePath: doc.filePath,
      })),
    }))

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Get nominated accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
