# Nominee Portal Feature

## Overview

The Nominee Portal provides a separate, read-only login system for nominees. This allows people who have been nominated to view only the accounts and investments where they are named as beneficiaries, without having access to the account holder's full dashboard.

## Key Features

### 1. Separate Authentication System
- **Nominee Login Page**: `/nominee-login`
- Nominees authenticate using their **phone number** and a **password**
- Separate JWT tokens stored in `nominee-auth-token` cookie
- Account holders and nominees have completely separate authentication systems

### 2. Account Holder Features

#### Enable Nominee Login
- Account holders can set a password for any nominee
- Click the key icon (🔑) next to a nominee in the Nominees page
- Enter and confirm the password
- Once set, the nominee can login using their phone number

#### Password Management
- Only account holders can set/reset nominee passwords
- Nominees cannot change their own passwords (contact account holder)

### 3. Nominee Portal Features

#### Dashboard (`/nominee/dashboard`)
- **View Only**: Nominees can see accounts where they are nominated
- **Allocation Display**: Shows their percentage allocation for each account
- **Estimated Share**: Calculates and displays their estimated share value
- **Other Nominees**: See who else is nominated for the same accounts (but not their allocations)
- **Account Details**: View account type, institution name, account number, status

#### Documents (`/nominee/documents`)
- **Critical Documents Only**: Nominees can only see documents marked as "Critical for Nominees"
- **Download Access**: Can download critical documents
- **Account Context**: Documents show which account they belong to

#### Profile (`/nominee/profile`)
- View their own information
- See who nominated them (account holder name/email)
- View relationship and contact details

### 4. Security & Privacy

#### Read-Only Access
- Nominees **cannot**:
  - Edit any account information
  - Add or remove nominees
  - Upload documents
  - Access account holder's other accounts
  - See accounts where they are not nominated
  - View non-critical documents

#### Data Isolation
- Nominees only see:
  - Accounts where they are explicitly linked as nominees
  - Their own allocation percentage
  - Critical documents related to their nominated accounts
  - Other nominees' names (but not their allocations or personal details)

#### Authentication Separation
- Account holder tokens (`auth-token`) and nominee tokens (`nominee-auth-token`) are separate
- Nominees cannot access account holder routes
- Account holders cannot access nominee routes (unless they are also nominees)

## User Flows

### Flow 1: Account Holder Enables Nominee Login
1. Account holder logs in
2. Goes to Nominees page
3. Clicks key icon (🔑) next to a nominee
4. Enters password (min 8 characters)
5. Confirms password
6. System sets password for nominee
7. Nominee can now login

### Flow 2: Nominee First Login
1. Nominee visits `/nominee-login`
2. Enters their registered phone number
3. Enters password (provided by account holder)
4. System authenticates and creates session
5. Redirects to `/nominee/dashboard`
6. Nominee sees all accounts where they are nominated

### Flow 3: Nominee Views Account Details
1. Nominee logs in
2. Views dashboard with list of accounts
3. Sees:
   - Institution name and account type
   - Account number
   - Their allocation percentage
   - Estimated share value
   - Other nominees (names only)
   - Critical documents (if any)

## API Endpoints

### Nominee Authentication
- `POST /api/nominee-auth/login` - Nominee login
- `POST /api/nominee-auth/logout` - Nominee logout
- `GET /api/nominee-auth/me` - Get current nominee info
- `POST /api/nominee-auth/setup-password` - Set password (account holder only)

### Nominee Data
- `GET /api/nominee/accounts` - Get accounts where nominee is linked

## Database Changes

### Schema Update
- Added `password` field to `Nominee` model (optional, nullable)
- Password is hashed using bcrypt (same as account holder passwords)

## Pages Created

1. `/nominee-login` - Nominee login page
2. `/nominee/dashboard` - Nominee dashboard (read-only)
3. `/nominee/documents` - Critical documents view
4. `/nominee/profile` - Nominee profile page

## Components Created

1. `NomineeLayout` - Layout component for nominee portal (separate from account holder layout)

## Security Considerations

1. **Password Requirements**: Minimum 8 characters (can be enhanced)
2. **Token Separation**: Different cookie names prevent cross-authentication
3. **Data Filtering**: API endpoints filter data to show only relevant information
4. **Read-Only**: No write/update/delete operations available to nominees

## Future Enhancements

1. Password reset flow for nominees (via email/SMS)
2. Email notifications when nominee login is enabled
3. Activity logs for nominee access
4. Two-factor authentication for nominees
5. Nominee consent/acknowledgment system
6. Ability for nominees to request additional information

## Testing Checklist

- [ ] Account holder can set password for nominee
- [ ] Nominee can login with phone + password
- [ ] Nominee sees only their nominated accounts
- [ ] Nominee sees correct allocation percentages
- [ ] Nominee can download critical documents
- [ ] Nominee cannot access account holder routes
- [ ] Account holder cannot access nominee routes
- [ ] Nominee logout works correctly
- [ ] Multiple nominees can login simultaneously
- [ ] Nominee sees other nominees' names but not details
