Hello, team!

You will need to install the following technologies on your system:
    -Node.js: https://nodejs.org/en/download 
        -Make sure the current LTS (v22.19.0) is selected
    -GitHub Desktop
        -Makes branching/cloning/pushing/pulling trivial
    -Docker Desktop
        -Allows for easy packaging of the software

The developer workflow to get the application running on your system is as follows (Make sure you're in the root of the directory to begin):

# Start DB
docker-compose up -d

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev

# Frontend
cd ../frontend
npm install
npm run dev


Finally, visit http://localhost:3000 to view the application.
Happy Coding!
-Matthew