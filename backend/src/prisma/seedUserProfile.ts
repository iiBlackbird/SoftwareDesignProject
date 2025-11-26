import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data 
  await prisma.volunteerHistory.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users with Profiles
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: 'password123',
      fullName: 'Alice Johnson',
      profile: {
        create: {
          fullName: 'Alice Johnson',
          address1: '123 Main St',
          city: 'Chicago',
          state: 'IL',
          zipcode: '60601',
          skills: ['First Aid', 'Event Management'],
          preferences: 'Prefers outdoor activities',
          availability: [
            new Date('2025-11-01'),
            new Date('2025-11-05'),
            new Date('2025-11-10'),
          ],
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: 'password123',
      fullName: 'Bob Smith',
      profile: {
        create: {
          fullName: 'Bob Smith',
          address1: '456 Pine Ave',
          city: 'Austin',
          state: 'TX',
          zipcode: '73301',
          skills: ['Cooking', 'Teaching'],
          preferences: 'Evening events',
          availability: [
            new Date('2025-11-03'),
            new Date('2025-11-05'),
          ],
        },
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      password: 'password123',
      fullName: 'Carol Davis',
      profile: {
        create: {
          fullName: 'Carol Davis',
          address1: '789 Elm Rd',
          city: 'New York',
          state: 'NY',
          zipcode: '10001',
          skills: ['Teaching', 'Fundraising', 'Event Management'],
          preferences: 'Weekends only',
          availability: [
            new Date('2025-11-02'),
            new Date('2025-11-09'),
          ],
        },
      },
    },
  });

  // Create Events with diverse location styles
  // await prisma.event.createMany({
  //   data: [
  //     {
  //       name: 'Community Clean-Up',
  //       description: 'Join us to clean the downtown area of Chicago.',
  //       location: 'Downtown Chicago, IL',
  //       requiredSkills: ['Event Management'],
  //       urgency: 'medium',
  //       eventDate: new Date('2025-11-05'),
  //     },
  //     {
  //       name: 'Food Drive',
  //       description: 'Help sort and distribute food in Austin.',
  //       location: 'Austin, TX',
  //       requiredSkills: ['Cooking'],
  //       urgency: 'high',
  //       eventDate: new Date('2025-11-03'),
  //     },
  //     {
  //       name: 'Online Volunteer Tutoring',
  //       description: 'Virtual event helping students learn math.',
  //       location: 'Online',
  //       requiredSkills: ['Teaching'],
  //       urgency: 'low',
  //       eventDate: new Date('2025-11-09'),
  //     },
  //     {
  //       name: 'Central Park Tree Planting',
  //       description: 'Help plant trees in Central Park.',
  //       location: 'Central Park, New York',
  //       requiredSkills: ['First Aid', 'Event Management'],
  //       urgency: 'medium',
  //       eventDate: new Date('2025-11-02'),
  //     },
  //     {
  //       name: 'Museum Fundraiser',
  //       description: 'Assist with ticketing and guest coordination.',
  //       location: 'Metropolitan Museum, NYC',
  //       requiredSkills: ['Fundraising', 'Event Management'],
  //       urgency: 'high',
  //       eventDate: new Date('2025-11-10'),
  //     },
  //   ],
  // });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
