import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashNomineePassword } from '@/lib/nominee-auth'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const setupPasswordSchema = z.object({
  nomineeId: z.string(),
  password: z.string().min(1, 'Password is required'), // Relaxed for testing
})

export async function POST(request: NextRequest) {
  try {
    const userPayload = await getCurrentUser()
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = setupPasswordSchema.parse(body)

    // Verify nominee belongs to the user
    const nominee = await prisma.nominee.findFirst({
      where: {
        id: validatedData.nomineeId,
        userId: userPayload.userId,
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Nominee not found' },
        { status: 404 }
      )
    }

    // Hash and set password
    const hashedPassword = await hashNomineePassword(validatedData.password)

    await prisma.nominee.update({
      where: { id: validatedData.nomineeId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: 'Password set successfully. Nominee can now login.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Setup nominee password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
