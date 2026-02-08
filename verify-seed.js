const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verify() {
  try {
    console.log('🔍 Verifying seed data...\n')

    // Find John Doe
    const johnDoe = await prisma.user.findUnique({
      where: { email: 'john.doe@example.com' },
    })

    if (!johnDoe) {
      console.log('❌ John Doe not found in database!')
      console.log('   Please run: npm run db:seed')
      return
    }

    console.log('✅ John Doe found:', {
      id: johnDoe.id,
      email: johnDoe.email,
      name: johnDoe.name,
    })

    // Find Sneha Patel
    const snehaPatel = await prisma.user.findUnique({
      where: { email: 'sneha.patel@example.com' },
    })

    if (!snehaPatel) {
      console.log('❌ Sneha Patel not found in database!')
      console.log('   Please run: npm run db:seed')
      return
    }

    console.log('✅ Sneha Patel found:', {
      id: snehaPatel.id,
      email: snehaPatel.email,
      name: snehaPatel.name,
    })

    // Check if John Doe is nominated by Sneha
    const johnNomineeRecord = await prisma.nominee.findFirst({
      where: {
        nominatedByUserId: snehaPatel.id,
        userId: johnDoe.id,
      },
    })

    if (!johnNomineeRecord) {
      console.log('❌ John Doe nominee record not found!')
      console.log('   Expected: Sneha Patel nominated John Doe')
      console.log('   Please run: npm run db:seed')
      return
    }

    console.log('✅ John Doe nominee record found:', {
      id: johnNomineeRecord.id,
      nominatedBy: snehaPatel.name,
      relationship: johnNomineeRecord.relationship,
    })

    // Check Sneha's accounts
    const snehaAccounts = await prisma.account.findMany({
      where: { userId: snehaPatel.id },
    })

    console.log(`\n📊 Sneha Patel's accounts: ${snehaAccounts.length}`)
    snehaAccounts.forEach((acc, idx) => {
      console.log(`   ${idx + 1}. ${acc.institutionName} - ${acc.accountType} (${acc.accountNumber})`)
    })

    // Check AccountNominee records for John Doe
    const johnNominatedAccounts = await prisma.accountNominee.findMany({
      where: { userId: johnDoe.id },
      include: {
        account: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    })

    console.log(`\n📊 John Doe's nominated accounts: ${johnNominatedAccounts.length}`)
    if (johnNominatedAccounts.length === 0) {
      console.log('❌ No AccountNominee records found for John Doe!')
      console.log('   This is the problem - the AccountNominee records are missing.')
      console.log('   Please run: npm run db:seed')
    } else {
      johnNominatedAccounts.forEach((an, idx) => {
        console.log(`   ${idx + 1}. ${an.account.institutionName} - ${an.allocationPercentage}%`)
        console.log(`      Account Owner: ${an.account.user.name || an.account.user.email}`)
        console.log(`      Account ID: ${an.accountId}`)
        console.log(`      UserId in AccountNominee: ${an.userId}`)
        console.log(`      NomineeId in AccountNominee: ${an.nomineeId}`)
      })
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    if (johnNominatedAccounts.length > 0) {
      console.log('✅ Seed data looks correct!')
      console.log('   If you still see 0 in the dashboard, check:')
      console.log('   1. Browser console for API errors')
      console.log('   2. Server logs for the API endpoint')
      console.log('   3. Try logging out and logging back in')
    } else {
      console.log('❌ Seed data is incomplete!')
      console.log('   Run: npm run db:seed')
    }
  } catch (error) {
    console.error('❌ Error verifying seed data:', error.message)
    if (error.message.includes('Can\'t reach database')) {
      console.log('\n💡 Database is not running!')
      console.log('   Start PostgreSQL: brew services start postgresql@14')
    }
  } finally {
    await prisma.$disconnect()
  }
}

verify()
