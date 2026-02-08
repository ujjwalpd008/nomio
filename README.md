# Nominee Dashboard MVP

A centralized platform to manage nominees across all your financial accounts. This MVP helps individuals track nominee information and ensure their loved ones can easily access what rightfully belongs to them.

## Features

### Core Features (MVP)
- ✅ User Authentication (Registration, Login, JWT-based sessions)
- ✅ Nominee Management (Add, Edit, Delete nominees)
- ✅ Account/Asset Management (Add accounts, link nominees with allocation percentages)
- ✅ Dashboard Overview (Statistics and quick actions)
- ✅ Document Storage (Upload, view, download documents - max 50 per user, 10MB per file)
- ✅ Trusted Contacts (Add up to 3 trusted contacts for emergency access)
- ✅ Settings Page

### Technology Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **File Storage**: Local filesystem (can be migrated to S3/Cloudflare R2)

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nominee_dashboard?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Create uploads directory**
   ```bash
   mkdir -p public/uploads
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nominee_dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── nominees/     # Nominee CRUD
│   │   ├── accounts/      # Account CRUD
│   │   ├── documents/    # Document management
│   │   └── trusted-contacts/ # Trusted contacts
│   ├── dashboard/        # Dashboard page
│   ├── nominees/         # Nominee pages
│   ├── accounts/         # Account pages
│   ├── documents/        # Document pages
│   ├── trusted-contacts/ # Trusted contact pages
│   └── settings/         # Settings page
├── components/           # React components
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication utilities
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Helper functions
├── prisma/              # Prisma schema
└── public/              # Static files and uploads
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Nominees
- `GET /api/nominees` - List all nominees
- `POST /api/nominees` - Create nominee
- `PUT /api/nominees/[id]` - Update nominee
- `DELETE /api/nominees/[id]` - Delete nominee

### Accounts
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/[id]` - Update account
- `DELETE /api/accounts/[id]` - Delete account

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Upload document (multipart/form-data)
- `DELETE /api/documents/[id]` - Delete document

### Trusted Contacts
- `GET /api/trusted-contacts` - List all trusted contacts
- `POST /api/trusted-contacts` - Create trusted contact
- `PUT /api/trusted-contacts/[id]` - Update trusted contact
- `DELETE /api/trusted-contacts/[id]` - Delete trusted contact

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

The application uses the following main models:
- `User` - Account holders
- `Nominee` - Nominee details
- `Account` - Financial accounts/assets
- `AccountNominee` - Many-to-many relationship with allocation percentages
- `Document` - Uploaded files metadata
- `TrustedContact` - Emergency contacts
- `EmergencyRequest` - Access requests (for future implementation)
- `NomineeAccess` - Nominee access records (for future implementation)
- `AuditLog` - Activity tracking (for future implementation)

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens stored in HTTP-only cookies
- Input validation with Zod
- File type and size validation
- User authorization checks on all API routes

## Future Enhancements (Post-MVP)

- Nominee Portal (read-only access for nominees)
- Emergency Access Flow (with death certificate verification)
- Email notifications
- Mobile app
- Integration with financial institutions
- Automated death certificate verification
- Multi-language support

## License

This is an MVP project. All rights reserved.

## Support

For issues or questions, please refer to the PRD.md file for detailed requirements and specifications.
