import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Insert the user profile
  
    await prisma.event.create({
        data: {
        id: 'event-123',
        name: 'Blood Drive',
        description: 'Community blood drive',
        location: 'Springfield',
        requiredSkills: ['First Aid'],
        urgency: 'High',
        eventDate: new Date('2025-10-20'),
        },
    });
  

}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
