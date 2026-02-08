import { NextResponse } from 'next/server'
import { getCurrentNominee } from '@/lib/nominee-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payload = await getCurrentNominee()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all accounts where this nominee is linked
    const accountNominees = await prisma.accountNominee.findMany({
      where: { nomineeId: payload.nomineeId },
      include: {
        account: {
          include: {
            accountNominees: {
              include: {
                nominee: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
            documents: {
              where: {
                isCritical: true, // Only show critical documents
              },
            },
          },
        },
      },
    })

    // Format response to show only relevant information
    const accounts = accountNominees.map((an) => ({
      id: an.account.id,
      accountType: an.account.accountType,
      institutionName: an.account.institutionName,
      accountNumber: an.account.accountNumber,
      approximateValue: an.account.approximateValue,
      status: an.account.status,
      allocationPercentage: an.allocationPercentage,
      allNominees: an.account.accountNominees.map((n) => ({
        fullName: n.nominee.fullName,
        allocationPercentage: n.allocationPercentage,
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
    console.error('Get nominee accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
