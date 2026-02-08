# Seed Data - Mock Users

## Quick Start

After running `npx prisma db push`, seed the database with mock data:

```bash
npm run db:seed
```

Or directly:
```bash
npx tsx prisma/seed.ts
```

## Mock Users Created

All users have password: **`123`**

### 1. John Doe (Account Holder)
- **Email:** john.doe@example.com
- **Phone:** 9876543210
- **Password:** 123
- **Has:** 3 accounts, 3 nominees, 1 trusted contact

### 2. Priya Sharma (Nominee)
- **Email:** priya.sharma@example.com
- **Phone:** 9876543211
- **Password:** 123
- **Status:** Nominated by John Doe, linked to user account
- **Nominated for:** 3 accounts (50%, 100%, 60% allocations)

### 3. Rahul Kumar (Nominee)
- **Email:** rahul.kumar@example.com
- **Phone:** 9876543212
- **Password:** 123
- **Status:** Nominated by John Doe, linked to user account
- **Nominated for:** 2 accounts (50%, 40% allocations)

### 4. Sneha Patel
- **Email:** sneha.patel@example.com
- **Phone:** 9876543213
- **Password:** 123
- **Status:** Standalone user (no nominees/accounts yet)

### 5. Amit Singh
- **Email:** amit.singh@example.com
- **Phone:** 9876543214
- **Password:** 123
- **Status:** Standalone user (no nominees/accounts yet)

## Test Data Created

### Accounts (John Doe)
1. **HDFC Bank** - Bank Account - ₹5,00,000
   - Nominees: Priya (50%), Rahul (50%)
2. **SBI Mutual Fund** - Mutual Fund - ₹10,00,000
   - Nominees: Priya (100%)
3. **LIC** - Life Insurance - ₹20,00,000
   - Nominees: Priya (60%), Rahul (40%)

### Nominees (John Doe)
1. **Priya Sharma** - Spouse
   - Linked to user account
   - Notification: Email + WhatsApp, Quarterly
2. **Rahul Kumar** - Child
   - Linked to user account
   - Notification: Email, Half-Yearly
3. **Rajesh Mehta** - Parent
   - Not yet signed up
   - Notification: WhatsApp, Annually

### Trusted Contact
- **Vikram Desai** - vikram.desai@example.com

## Testing Scenarios

### Scenario 1: Account Holder Login
- Login as: john.doe@example.com / 123
- See: 3 accounts, 3 nominees, dashboard stats

### Scenario 2: Nominee Login
- Login as: priya.sharma@example.com / 123
- See: 3 accounts in "Nominated For" tab
- Total estimated share: ₹17,00,000

### Scenario 3: Nominee Login (Rahul)
- Login as: rahul.kumar@example.com / 123
- See: 2 accounts in "Nominated For" tab
- Total estimated share: ₹9,00,000

### Scenario 4: New User
- Login as: sneha.patel@example.com / 123
- See: Empty dashboard (no accounts, not nominated)

## Notes

- All passwords are set to `123` for easy testing
- Some nominees are linked to user accounts (they've signed up)
- Some nominees are not yet linked (haven't signed up)
- Accounts have realistic Indian institution names
- Allocation percentages are set up for testing

## Re-seeding

If you need to reset and re-seed:
```bash
npx prisma db push --force-reset
npm run db:seed
```

This will delete all data and recreate the mock users.
