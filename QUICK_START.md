# Quick Start Guide

## Step 1: Install Node.js

You need Node.js 18+ to run this application.

**Option A: Using Homebrew (Recommended for macOS)**
```bash
brew install node
```

**Option B: Download from website**
- Visit https://nodejs.org/
- Download and install the LTS version

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

## Step 2: Install PostgreSQL Database

**Using Homebrew:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Or download from:**
- https://www.postgresql.org/download/macosx/

**Create database:**
```bash
createdb nominee_dashboard
```

## Step 3: Install Project Dependencies

```bash
cd /Users/ujjwal/Desktop/Startup/nominee_dashboard
npm install
```

This will install all required packages (Next.js, React, Prisma, etc.)

## Step 4: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cat > .env << EOF
DATABASE_URL="postgresql://$(whoami)@localhost:5432/nominee_dashboard?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-characters-long"
EOF
```

**Or manually create `.env` file with:**
```
DATABASE_URL="postgresql://your_username@localhost:5432/nominee_dashboard?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-characters-long"
```

**Note:** Replace `your_username` with your PostgreSQL username (usually your macOS username).

**Important:** Use `EOF` (without quotes) to allow shell variable expansion of `$(whoami)`.

## Step 5: Set Up Database Schema

```bash
npx prisma generate
npx prisma db push
```

This creates all the database tables.

## Step 6: Create Uploads Directory

```bash
mkdir -p public/uploads
```

## Step 7: Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## Step 8: Open in Browser

Open http://localhost:3000 in your browser.

## First Steps After Launch

1. Click "Get Started" or go to `/register`
2. Create your account
3. You'll be redirected to the dashboard
4. Add your first nominee
5. Add a financial account and link it to your nominee

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again

### Database connection errors
- Check PostgreSQL is running: `brew services list | grep postgresql`
- Verify DATABASE_URL in `.env` matches your PostgreSQL setup
- Try: `psql -d nominee_dashboard` to test connection

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

### Prisma errors
```bash
npx prisma generate
npx prisma db push --force-reset  # WARNING: This deletes all data
```

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI (runs on http://localhost:5555)
```

## Need Help?

Check the `README.md` and `SETUP.md` files for more detailed information.
