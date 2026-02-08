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
    const validatedData = accountSchema.parse(body)

    // Check if account belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!existingAccount) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    // Validate allocation percentages
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

      // Verify nominees belong to user
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

    // Update account and nominees
    await prisma.accountNominee.deleteMany({
      where: { accountId: params.id },
    })

    const account = await prisma.account.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json({ account })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Update account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getCurrentUser()
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const account = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: payload.userId,
      },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    await prisma.account.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
