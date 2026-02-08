import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const accountSchema = z.object({
  accountType: z.enum([
    'Bank Account',
    'Mutual Fund',
    'Life Insurance',
    'Health Insurance',
    'Term Insurance',
    'Demat Account',
    'PPF',
    'EPF',
    'NPS',
    'Fixed Deposit',
    'Other',
  ]),
  institutionName: z.string().min(1, 'Institution name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  approximateValue: z.number().optional(),
  status: z.enum(['Active', 'Closed']).default('Active'),
  notes: z.string().optional(),
  nominees: z.array(z.object({
    nomineeId: z.string(),
    allocationPercentage: z.number().min(0).max(100),
  })).optional(),
})

export async function GET() {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accounts = await prisma.account.findMany({
      where: { userId: payload.userId },
      include: {
        accountNominees: {
          include: {
            nominee: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Get accounts error:', error)
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
    const validatedData = accountSchema.parse(body)

    // Validate allocation percentages sum to 100
    let nominees: any[] = []
    if (validatedData.nominees && validatedData.nominees.length > 0) {
      const totalAllocation = validatedData.nominees.reduce(
        (sum, n) => sum + n.allocationPercentage,
        0
      )
      if (Math.abs(totalAllocation - 100) > 0.01) {
        return NextResponse.json(
          { error: 'Nominee allocation percentages must total 100%' },
          { status: 400 }
        )
      }

      // Verify all nominees belong to the user
      const nomineeIds = validatedData.nominees.map(n => n.nomineeId)
      nominees = await prisma.nominee.findMany({
        where: {
          id: { in: nomineeIds },
          nominatedByUserId: payload.userId,
        },
      })

      if (nominees.length !== nomineeIds.length) {
        return NextResponse.json(
          { error: 'One or more nominees not found' },
          { status: 400 }
        )
      }
    }

    // Create account with nominees
    const account = await prisma.account.create({
      data: {
        userId: payload.userId,
        accountType: validatedData.accountType,
        institutionName: validatedData.institutionName,
        accountNumber: validatedData.accountNumber,
        approximateValue: validatedData.approximateValue || null,
        status: validatedData.status,
        notes: validatedData.notes || null,
        accountNominees: validatedData.nominees
          ? {
              create: validatedData.nominees.map(n => {
                const nominee = nominees.find(nom => nom.id === n.nomineeId)
                return {
                  nomineeId: n.nomineeId,
                  userId: nominee?.userId || null, // Link to User if nominee has signed up
                  allocationPercentage: n.allocationPercentage,
                }
              }),
            }
          : undefined,
      },
      include: {
        accountNominees: {
          include: {
            nominee: true,
          },
        },
      },
    })

    return NextResponse.json({ account }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
