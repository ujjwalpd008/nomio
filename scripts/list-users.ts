import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        // Don't select password for security
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('\n=== Users in Database ===\n')
    console.log(`Total Users: ${users.length}\n`)

    if (users.length === 0) {
      console.log('No users found in database.')
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.id}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Phone: ${user.phone || 'Not set'}`)
        console.log(`   Name: ${user.name || 'Not set'}`)
        console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
        console.log(`   Created: ${user.createdAt.toLocaleString()}`)
        console.log(`   Password: [HASHED - Not readable for security]`)
        console.log('')
      })
    }

    // Also check nominees
    const nominees = await prisma.nominee.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        relationship: true,
        userId: true,
        nominatedByUserId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('\n=== Nominees in Database ===\n')
    console.log(`Total Nominees: ${nominees.length}\n`)

    if (nominees.length === 0) {
      console.log('No nominees found in database.')
    } else {
      nominees.forEach((nominee, index) => {
        console.log(`${index + 1}. Nominee ID: ${nominee.id}`)
        console.log(`   Name: ${nominee.fullName}`)
        console.log(`   Email: ${nominee.email || 'Not set'}`)
        console.log(`   Phone: ${nominee.phone}`)
        console.log(`   Relationship: ${nominee.relationship}`)
        console.log(`   Linked to User: ${nominee.userId ? 'Yes' : 'No'}`)
        console.log(`   Nominated By User ID: ${nominee.nominatedByUserId}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('Error listing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
