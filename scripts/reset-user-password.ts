import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Get email from command line argument
const email = process.argv[2]
const newPassword = process.argv[3] || '123' // Default to '123' if not provided

async function resetUserPassword() {
  try {
    if (!email) {
      console.log('\nUsage: npx tsx scripts/reset-user-password.ts <email> [new-password]')
      console.log('Example: npx tsx scripts/reset-user-password.ts user@example.com test123\n')
      process.exit(1)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      console.log(`\n❌ User with email "${email}" not found\n`)
      await prisma.$disconnect()
      process.exit(1)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    })

    console.log(`\n✅ Password reset successful!`)
    console.log(`\nUser: ${user.name || 'N/A'} (${user.email})`)
    console.log(`New password: "${newPassword}"`)
    console.log(`\nYou can now login with these credentials.\n`)
  } catch (error) {
    console.error('Error resetting password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetUserPassword()
