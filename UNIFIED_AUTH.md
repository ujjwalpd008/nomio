# Unified Authentication System

## Overview

The application now uses a **single signup/login flow** for all users. Whether you're an account holder or a nominee, everyone signs up the same way and sees a unified dashboard with tabs showing:
- **My Accounts** - Accounts you own
- **Nominated For** - Accounts where you're nominated as a beneficiary

## Key Changes

### 1. Single Signup/Login Flow
- **Before**: Separate login pages for account holders and nominees
- **Now**: One signup page (`/register`) and one login page (`/login`) for everyone

### 2. Unified Dashboard
- **Overview Tab**: Shows statistics and quick actions
- **My Accounts Tab**: Shows accounts you own (as account holder)
- **Nominated For Tab**: Shows accounts where you're nominated (as nominee)

### 3. Automatic Nominee Matching
- When someone signs up, the system automatically matches them to existing nominee records by email or phone
- If you were added as a nominee before signing up, your account will be linked automatically
- You'll immediately see accounts where you're nominated in the "Nominated For" tab

### 4. Database Schema Updates

#### Nominee Model
- `nominatedByUserId`: User who created this nominee record
- `userId`: User account if nominee has signed up (nullable)
- Removed `password` field (no longer needed)

#### AccountNominee Model
- `nomineeId`: Links to Nominee record (for people not yet signed up)
- `userId`: Links to User account (for people who have signed up)
- Both fields are nullable - one must be set

## User Flows

### Flow 1: Account Holder Signs Up First
1. User signs up at `/register`
2. Creates account, adds nominees
3. Nominees see accounts when they sign up later

### Flow 2: Nominee Signs Up After Being Added
1. Account holder adds nominee (with email/phone)
2. Nominee signs up at `/register` with matching email/phone
3. System automatically links nominee record to user account
4. Nominee immediately sees accounts in "Nominated For" tab

### Flow 3: Both Sign Up Independently
1. User A signs up and adds User B as nominee
2. User B signs up independently
3. When User A adds User B, system matches by email/phone
4. User B sees accounts in "Nominated For" tab

## Dashboard Features

### Overview Tab
- Statistics cards showing:
  - My Accounts count
  - Nominated For count
  - Total Value
  - Documents
  - Nominees
  - Trusted Contacts
- Quick action buttons

### My Accounts Tab
- List of accounts you own
- Can edit/delete accounts
- Shows nominees linked to each account
- Shows allocation percentages

### Nominated For Tab
- List of accounts where you're nominated
- Shows your allocation percentage
- Shows estimated share value
- Shows account owner information
- Shows other nominees (names only)
- Shows critical documents (downloadable)

## API Changes

### New Endpoints
- `GET /api/dashboard/my-accounts` - Get accounts owned by user
- `GET /api/dashboard/nominated-accounts` - Get accounts where user is nominated

### Updated Endpoints
- `POST /api/auth/register` - Now matches nominees during signup
- `GET /api/nominees` - Returns user link status
- `GET /api/accounts` - Supports both nominee and user links

## Removed Features

- ❌ Separate nominee login page (`/nominee-login`)
- ❌ Nominee password setup
- ❌ Separate nominee authentication system
- ❌ Nominee portal pages (`/nominee/*`)

## Benefits

1. **Simplified UX**: One login for everyone
2. **Better User Experience**: Users see everything in one place
3. **Automatic Matching**: No manual linking needed
4. **Unified Interface**: Consistent experience for all users
5. **Easier Onboarding**: Nominees just sign up like anyone else

## Migration Notes

If you have existing data:
1. Run `npx prisma db push` to update schema
2. Existing nominee records will need to be linked manually or wait for users to sign up
3. Nominees who had passwords set will need to sign up normally

## Testing Checklist

- [ ] User can sign up
- [ ] User sees "My Accounts" tab (empty if no accounts)
- [ ] User sees "Nominated For" tab (empty if not nominated)
- [ ] Adding nominee with email/phone matches existing user
- [ ] Nominee signs up and sees accounts automatically
- [ ] Account holder can add/edit/delete accounts
- [ ] Nominated user can view but not edit accounts
- [ ] Critical documents visible to nominees
- [ ] Allocation percentages display correctly
