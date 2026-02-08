const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for all users (using simple password "123" for testing)
  const hashedPassword = await bcrypt.hash('123', 10)

  // Create mock users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        phone: '9876543210',
        password: hashedPassword,
        name: 'John Doe',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya.sharma@example.com' },
      update: {},
      create: {
        email: 'priya.sharma@example.com',
        phone: '9876543211',
        password: hashedPassword,
        name: 'Priya Sharma',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'rahul.kumar@example.com' },
      update: {},
      create: {
        email: 'rahul.kumar@example.com',
        phone: '9876543212',
        password: hashedPassword,
        name: 'Rahul Kumar',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sneha.patel@example.com' },
      update: {},
      create: {
        email: 'sneha.patel@example.com',
        phone: '9876543213',
        password: hashedPassword,
        name: 'Sneha Patel',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'amit.singh@example.com' },
      update: {},
      create: {
        email: 'amit.singh@example.com',
        phone: '9876543214',
        password: hashedPassword,
        name: 'Amit Singh',
        emailVerified: true,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Delete existing nominees for John Doe (if re-seeding)
  await prisma.nominee.deleteMany({
    where: { nominatedByUserId: users[0].id },
  })

  // Create nominees for first user (John Doe)
  const johnDoe = users[0]
  const nominees = await Promise.all([
    prisma.nominee.create({
      data: {
        nominatedByUserId: johnDoe.id,
        userId: users[1].id, // Priya Sharma is linked
        fullName: 'Priya Sharma',
        relationship: 'Spouse',
        email: 'priya.sharma@example.com',
        phone: '9876543211',
        notificationChannels: ['Email', 'WhatsApp'],
        notificationFrequency: 'Quarterly',
      },
    }),
    prisma.nominee.create({
      data: {
        nominatedByUserId: johnDoe.id,
        userId: users[2].id, // Rahul Kumar is linked
        fullName: 'Rahul Kumar',
        relationship: 'Child',
        email: 'rahul.kumar@example.com',
        phone: '9876543212',
        notificationChannels: ['Email'],
        notificationFrequency: 'HalfYearly',
      },
    }),
    prisma.nominee.create({
      data: {
        nominatedByUserId: johnDoe.id,
        fullName: 'Rajesh Mehta',
        relationship: 'Parent',
        email: 'rajesh.mehta@example.com',
        phone: '9876543215',
        notificationChannels: ['WhatsApp'],
        notificationFrequency: 'Annually',
      },
    }),
  ])

  console.log(`✅ Created ${nominees.length} nominees`)

  // Delete existing accounts for John Doe (if re-seeding)
  await prisma.account.deleteMany({
    where: { userId: johnDoe.id },
  })

  // Create accounts for John Doe
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        userId: johnDoe.id,
        accountType: 'Bank Account',
        institutionName: 'HDFC Bank',
        accountNumber: '1234567890',
        approximateValue: 500000,
        status: 'Active',
        notes: 'Primary savings account',
      },
    }),
    prisma.account.create({
      data: {
        userId: johnDoe.id,
        accountType: 'Mutual Fund',
        institutionName: 'SBI Mutual Fund',
        accountNumber: 'MF123456',
        approximateValue: 1000000,
        status: 'Active',
        notes: 'Equity mutual fund',
      },
    }),
    prisma.account.create({
      data: {
        userId: johnDoe.id,
        accountType: 'Life Insurance',
        institutionName: 'LIC',
        accountNumber: 'LIC789012',
        approximateValue: 2000000,
        status: 'Active',
        notes: 'Term insurance policy',
      },
    }),
  ])

  console.log(`✅ Created ${accounts.length} accounts`)

  // Delete existing account nominees for these accounts (if re-seeding)
  await prisma.accountNominee.deleteMany({
    where: {
      accountId: { in: accounts.map(a => a.id) },
    },
  })

  // Link nominees to accounts
  await Promise.all([
    prisma.accountNominee.create({
      data: {
        accountId: accounts[0].id,
        nomineeId: nominees[0].id,
        userId: nominees[0].userId,
        allocationPercentage: 50,
      },
    }),
    prisma.accountNominee.create({
      data: {
        accountId: accounts[0].id,
        nomineeId: nominees[1].id,
        userId: nominees[1].userId,
        allocationPercentage: 50,
      },
    }),
    prisma.accountNominee.create({
      data: {
        accountId: accounts[1].id,
        nomineeId: nominees[0].id,
        userId: nominees[0].userId,
        allocationPercentage: 100,
      },
    }),
    prisma.accountNominee.create({
      data: {
        accountId: accounts[2].id,
        nomineeId: nominees[0].id,
        userId: nominees[0].userId,
        allocationPercentage: 60,
      },
    }),
    prisma.accountNominee.create({
      data: {
        accountId: accounts[2].id,
        nomineeId: nominees[1].id,
        userId: nominees[1].userId,
        allocationPercentage: 40,
      },
    }),
  ])

  console.log(`✅ Linked nominees to accounts`)

  // Delete existing trusted contacts for John Doe (if re-seeding)
  await prisma.trustedContact.deleteMany({
    where: { userId: johnDoe.id },
  })

  // Create trusted contacts for John Doe
  await prisma.trustedContact.create({
    data: {
      userId: johnDoe.id,
      name: 'Vikram Desai',
      email: 'vikram.desai@example.com',
      phone: '9876543216',
    },
  })

  console.log(`✅ Created trusted contact`)

  // Create accounts for Sneha Patel (so John Doe can be nominated)
  const snehaPatel = users[3]
  
  // Delete existing accounts for Sneha Patel (if re-seeding)
  await prisma.account.deleteMany({
    where: { userId: snehaPatel.id },
  })

  // Create accounts for Sneha Patel
  const snehaAccounts = await Promise.all([
    prisma.account.create({
      data: {
        userId: snehaPatel.id,
        accountType: 'Bank Account',
        institutionName: 'ICICI Bank',
        accountNumber: '9876543210',
        approximateValue: 750000,
        status: 'Active',
        notes: 'Salary account',
      },
    }),
    prisma.account.create({
      data: {
        userId: snehaPatel.id,
        accountType: 'Mutual Fund',
        institutionName: 'Axis Mutual Fund',
        accountNumber: 'MF987654',
        approximateValue: 1500000,
        status: 'Active',
        notes: 'Debt mutual fund',
      },
    }),
  ])

  console.log(`✅ Created ${snehaAccounts.length} accounts for Sneha Patel`)

  // Delete existing nominees for Sneha Patel (if re-seeding)
  await prisma.nominee.deleteMany({
    where: { nominatedByUserId: snehaPatel.id },
  })

  // Create nominees for Sneha Patel, including John Doe
  const snehaNominees = await Promise.all([
    prisma.nominee.create({
      data: {
        nominatedByUserId: snehaPatel.id,
        userId: johnDoe.id, // John Doe is linked
        fullName: 'John Doe',
        relationship: 'Brother',
        email: 'john.doe@example.com',
        phone: '9876543210',
        notificationChannels: ['Email', 'WhatsApp'],
        notificationFrequency: 'Quarterly',
      },
    }),
    prisma.nominee.create({
      data: {
        nominatedByUserId: snehaPatel.id,
        userId: users[4].id, // Amit Singh is linked
        fullName: 'Amit Singh',
        relationship: 'Friend',
        email: 'amit.singh@example.com',
        phone: '9876543214',
        notificationChannels: ['Email'],
        notificationFrequency: 'HalfYearly',
      },
    }),
  ])

  console.log(`✅ Created ${snehaNominees.length} nominees for Sneha Patel`)

  // Delete existing account nominees for Sneha's accounts (if re-seeding)
  await prisma.accountNominee.deleteMany({
    where: {
      accountId: { in: snehaAccounts.map(a => a.id) },
    },
  })

  // Link nominees to Sneha's accounts (John Doe gets 60% of first account, 100% of second)
  await Promise.all([
    prisma.accountNominee.create({
      data: {
        accountId: snehaAccounts[0].id,
        nomineeId: snehaNominees[0].id, // John Doe
        userId: snehaNominees[0].userId,
        allocationPercentage: 60,
      },
    }),
    prisma.accountNominee.create({
      data: {
        accountId: snehaAccounts[0].id,
        nomineeId: snehaNominees[1].id, // Amit Singh
        userId: snehaNominees[1].userId,
        allocationPercentage: 40,
      },
    }),
    prisma.accountNominee.create({
      data: {
        accountId: snehaAccounts[1].id,
        nomineeId: snehaNominees[0].id, // John Doe gets 100%
        userId: snehaNominees[0].userId,
        allocationPercentage: 100,
      },
    }),
  ])

  console.log(`✅ Linked nominees to Sneha Patel's accounts`)

  console.log('\n🎉 Seeding completed!')
  console.log('\n📝 Test Users (Password for all: "123"):')
  console.log('   1. john.doe@example.com - John Doe (has nominees, accounts, AND nominated by Sneha)')
  console.log('   2. priya.sharma@example.com - Priya Sharma (nominated by John)')
  console.log('   3. rahul.kumar@example.com - Rahul Kumar (nominated by John)')
  console.log('   4. sneha.patel@example.com - Sneha Patel (has accounts, nominated John Doe)')
  console.log('   5. amit.singh@example.com - Amit Singh (nominated by Sneha)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
