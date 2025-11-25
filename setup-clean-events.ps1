# 🚀 Setting up clean user events database...

# 1. Start the database
Write-Host "1️⃣ Starting PostgreSQL database..." -ForegroundColor Green
docker-compose up -d

# Wait a moment for database to start
Write-Host "⏳ Waiting for database to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 2. Generate Prisma client
Write-Host "2️⃣ Generating Prisma client..." -ForegroundColor Green
Set-Location backend
npx prisma generate

# 3. Run migrations
Write-Host "3️⃣ Creating database migration..." -ForegroundColor Green
npx prisma migrate dev --name add-user-events-association

# 4. Clear existing events
Write-Host "4️⃣ Clearing pre-seeded events..." -ForegroundColor Green
npx tsx scripts/clear-events.ts

Write-Host "✅ Setup complete! All users now start with a clean slate." -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   - Users can now create their own events" -ForegroundColor White
Write-Host "   - Events are associated with the user who created them" -ForegroundColor White
Write-Host "   - The events page will show only user-created events" -ForegroundColor White