import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// WARNING: This endpoint should be protected in production!
// For now, it's open for development purposes only.

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        // Password is hashed and not included for security
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const nominees = await prisma.nominee.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        relationship: true,
        userId: true,
        nominatedByUserId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      users,
      nominees,
      note: 'Passwords are hashed using bcrypt and cannot be retrieved. To reset a password, use the password reset flow or create a new account.',
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
