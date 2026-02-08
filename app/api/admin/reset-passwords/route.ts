import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// WARNING: This endpoint should be protected in production!
// For testing purposes only.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password = '123', email } = body // Default password is '123'

    if (email) {
      // Reset password for specific user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const hashedPassword = await hashPassword(password)
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      })

      return NextResponse.json({
        success: true,
        message: `Password reset for ${email}`,
        password,
      })
    } else {
      // Reset passwords for all users
      const hashedPassword = await hashPassword(password)
      const result = await prisma.user.updateMany({
        data: { password: hashedPassword },
      })

      return NextResponse.json({
        success: true,
        message: `Reset passwords for ${result.count} user(s)`,
        password,
        count: result.count,
      })
    }
  } catch (error) {
    console.error('Error resetting passwords:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
