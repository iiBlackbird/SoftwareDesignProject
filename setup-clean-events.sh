#!/bin/bash

echo "🚀 Setting up clean user events database..."

# 1. Start the database
echo "1️⃣ Starting PostgreSQL database..."
docker-compose up -d

# Wait a moment for database to start
echo "⏳ Waiting for database to start..."
sleep 5

# 2. Generate Prisma client
echo "2️⃣ Generating Prisma client..."
cd backend
npx prisma generate

# 3. Run migrations
echo "3️⃣ Creating database migration..."
npx prisma migrate dev --name add-user-events-association

# 4. Clear existing events
echo "4️⃣ Clearing pre-seeded events..."
npx tsx scripts/clear-events.ts

echo "✅ Setup complete! All users now start with a clean slate."
echo "📝 Next steps:"
echo "   - Users can now create their own events"
echo "   - Events are associated with the user who created them"
echo "   - The events page will show only user-created events"