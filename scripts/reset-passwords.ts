import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetPasswords() {
  try {
    // Set a simple test password for all users
    const testPassword = '123' // You can change this to any password you want
    const hashedPassword = await bcrypt.hash(testPassword, 10)

    // Update all users with the test password
    const result = await prisma.user.updateMany({
      data: {
        password: hashedPassword,
      },
    })

    console.log(`\n✅ Successfully updated ${result.count} user(s)`)
    console.log(`\nAll users can now login with password: "${testPassword}"`)
    console.log('\nUser emails:')

    // List all users
    const users = await prisma.user.findMany({
      select: {
        email: true,
        phone: true,
        name: true,
      },
    })

    users.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email}${user.phone ? ` | Phone: ${user.phone}` : ''}${user.name ? ` | Name: ${user.name}` : ''}`)
    })

    console.log(`\n📝 Login credentials:`)
    console.log(`   Password for all users: "${testPassword}"`)
    console.log(`\n⚠️  WARNING: This is for testing only! Change passwords in production.\n`)
  } catch (error) {
    console.error('Error resetting passwords:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetPasswords()
