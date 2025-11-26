import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearEvents() {
  try {
    console.log('Clearing all events from database...');
    
    // First clear volunteer histories that reference events
    await prisma.volunteerHistory.deleteMany({});
    console.log('Cleared volunteer histories');
    
    // Clear notifications that reference events
    await prisma.notification.deleteMany({
      where: {
        eventId: {
          not: null
        }
      }
    });
    console.log('Cleared event notifications');
    
    // Now clear all events
    const deletedCount = await prisma.event.deleteMany({});
    
    console.log(`✅ Successfully deleted ${deletedCount.count} events`);
    console.log('All users now start with a clean slate - no pre-seeded events');
  } catch (error) {
    console.error('❌ Error clearing events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearEvents();