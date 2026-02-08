import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyNomineePassword, generateNomineeToken, setNomineeAuthToken } from '@/lib/nominee-auth'
import { z } from 'zod'

const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Find nominee by phone
    const nominee = await prisma.nominee.findFirst({
      where: { phone: validatedData.phone },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        password: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!nominee) {
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      )
    }

    // Check if nominee has a password set
    if (!nominee.password) {
      return NextResponse.json(
        { error: 'Account not activated. Please contact the account holder to set up your access.' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyNomineePassword(validatedData.password, nominee.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateNomineeToken({
      nomineeId: nominee.id,
      phone: nominee.phone,
      type: 'nominee',
    })

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      nominee: {
        id: nominee.id,
        fullName: nominee.fullName,
        phone: nominee.phone,
        email: nominee.email,
      },
    })

    await setNomineeAuthToken(token)

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Nominee login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
