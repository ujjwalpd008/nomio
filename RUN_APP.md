# How to Run the App

## Step-by-Step Instructions

### 1. Start PostgreSQL Database

**Option A: Using Homebrew Services (Recommended)**
```bash
brew services start postgresql@14
```

**Option B: Manual Start**
```bash
pg_ctl -D /opt/homebrew/var/postgresql@14 start
```

**Verify PostgreSQL is running:**
```bash
pg_isready -h localhost -p 5432
```
Should output: `localhost:5432 - accepting connections`

### 2. Create Database (if not exists)

```bash
createdb nominee_dashboard
```

**Or using psql:**
```bash
psql -U ujjwal -d postgres -c "CREATE DATABASE nominee_dashboard;"
```

### 3. Set Up Database Schema

```bash
cd /Users/ujjwal/Desktop/Startup/nominee_dashboard
npx prisma generate
npx prisma db push
```

### 4. Verify .env File

Make sure `.env` file exists with:
```
DATABASE_URL="postgresql://ujjwal@localhost:5432/nominee_dashboard?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-characters-long"
```

### 5. Create Uploads Directory (if not exists)

```bash
mkdir -p public/uploads
```

### 6. Run the App

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## Troubleshooting PostgreSQL Connection Issues

### If you get "Operation not permitted" error:

1. **Check PostgreSQL is actually running:**
   ```bash
   brew services list | grep postgresql
   ```

2. **Try starting with sudo (if needed):**
   ```bash
   sudo brew services start postgresql@14
   ```

3. **Check PostgreSQL socket location:**
   ```bash
   ls -la /tmp/.s.PGSQL.5432
   ```

4. **Try connecting via TCP/IP instead of socket:**
   Update `.env`:
   ```
   DATABASE_URL="postgresql://ujjwal:password@127.0.0.1:5432/nominee_dashboard?schema=public"
   ```
   (Replace `password` with your PostgreSQL password if you set one)

5. **Check PostgreSQL logs:**
   ```bash
   tail -f /opt/homebrew/var/log/postgresql@14.log
   ```

### Alternative: Use SQLite for Development (Easier Setup)

If PostgreSQL continues to give issues, you can temporarily use SQLite:

1. **Update `prisma/schema.prisma`:**
   Change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   To:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Update `.env`:**
   ```
   DATABASE_URL="file:./dev.db"
   ```

3. **Reset and push schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## Quick Start (All Commands Together)

```bash
# Navigate to project
cd /Users/ujjwal/Desktop/Startup/nominee_dashboard

# Start PostgreSQL
brew services start postgresql@14

# Wait a few seconds, then create database
sleep 3
createdb nominee_dashboard

# Set up Prisma
npx prisma generate
npx prisma db push

# Create uploads directory
mkdir -p public/uploads

# Run the app
npm run dev
```

---

## Verify Everything is Working

1. **Check Node.js:** `node --version` (should show v18+)
2. **Check npm:** `npm --version`
3. **Check PostgreSQL:** `pg_isready` (should say "accepting connections")
4. **Check database:** `psql -d nominee_dashboard -c "\dt"` (should show tables)
5. **Check app:** Open http://localhost:3000 in browser

---

## Common Issues

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Prisma errors
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Database connection errors
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env matches your setup
- Try restarting PostgreSQL: `brew services restart postgresql@14`
