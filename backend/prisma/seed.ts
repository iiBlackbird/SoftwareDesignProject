import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const statesData = [
  { name: 'Alabama', abbreviation: 'AL', capital: 'Montgomery', region: 'South' },
  { name: 'Alaska', abbreviation: 'AK', capital: 'Juneau', region: 'West' },
  { name: 'Arizona', abbreviation: 'AZ', capital: 'Phoenix', region: 'West' },
  { name: 'Arkansas', abbreviation: 'AR', capital: 'Little Rock', region: 'South' },
  { name: 'California', abbreviation: 'CA', capital: 'Sacramento', region: 'West' },
  { name: 'Colorado', abbreviation: 'CO', capital: 'Denver', region: 'West' },
  { name: 'Connecticut', abbreviation: 'CT', capital: 'Hartford', region: 'Northeast' },
  { name: 'Delaware', abbreviation: 'DE', capital: 'Dover', region: 'Northeast' },
  { name: 'Florida', abbreviation: 'FL', capital: 'Tallahassee', region: 'South' },
  { name: 'Georgia', abbreviation: 'GA', capital: 'Atlanta', region: 'South' },
  { name: 'Hawaii', abbreviation: 'HI', capital: 'Honolulu', region: 'West' },
  { name: 'Idaho', abbreviation: 'ID', capital: 'Boise', region: 'West' },
  { name: 'Illinois', abbreviation: 'IL', capital: 'Springfield', region: 'Midwest' },
  { name: 'Indiana', abbreviation: 'IN', capital: 'Indianapolis', region: 'Midwest' },
  { name: 'Iowa', abbreviation: 'IA', capital: 'Des Moines', region: 'Midwest' },
  { name: 'Kansas', abbreviation: 'KS', capital: 'Topeka', region: 'Midwest' },
  { name: 'Kentucky', abbreviation: 'KY', capital: 'Frankfort', region: 'South' },
  { name: 'Louisiana', abbreviation: 'LA', capital: 'Baton Rouge', region: 'South' },
  { name: 'Maine', abbreviation: 'ME', capital: 'Augusta', region: 'Northeast' },
  { name: 'Maryland', abbreviation: 'MD', capital: 'Annapolis', region: 'Northeast' },
  { name: 'Massachusetts', abbreviation: 'MA', capital: 'Boston', region: 'Northeast' },
  { name: 'Michigan', abbreviation: 'MI', capital: 'Lansing', region: 'Midwest' },
  { name: 'Minnesota', abbreviation: 'MN', capital: 'Saint Paul', region: 'Midwest' },
  { name: 'Mississippi', abbreviation: 'MS', capital: 'Jackson', region: 'South' },
  { name: 'Missouri', abbreviation: 'MO', capital: 'Jefferson City', region: 'Midwest' },
  { name: 'Montana', abbreviation: 'MT', capital: 'Helena', region: 'West' },
  { name: 'Nebraska', abbreviation: 'NE', capital: 'Lincoln', region: 'Midwest' },
  { name: 'Nevada', abbreviation: 'NV', capital: 'Carson City', region: 'West' },
  { name: 'New Hampshire', abbreviation: 'NH', capital: 'Concord', region: 'Northeast' },
  { name: 'New Jersey', abbreviation: 'NJ', capital: 'Trenton', region: 'Northeast' },
  { name: 'New Mexico', abbreviation: 'NM', capital: 'Santa Fe', region: 'West' },
  { name: 'New York', abbreviation: 'NY', capital: 'Albany', region: 'Northeast' },
  { name: 'North Carolina', abbreviation: 'NC', capital: 'Raleigh', region: 'South' },
  { name: 'North Dakota', abbreviation: 'ND', capital: 'Bismarck', region: 'Midwest' },
  { name: 'Ohio', abbreviation: 'OH', capital: 'Columbus', region: 'Midwest' },
  { name: 'Oklahoma', abbreviation: 'OK', capital: 'Oklahoma City', region: 'South' },
  { name: 'Oregon', abbreviation: 'OR', capital: 'Salem', region: 'West' },
  { name: 'Pennsylvania', abbreviation: 'PA', capital: 'Harrisburg', region: 'Northeast' },
  { name: 'Rhode Island', abbreviation: 'RI', capital: 'Providence', region: 'Northeast' },
  { name: 'South Carolina', abbreviation: 'SC', capital: 'Columbia', region: 'South' },
  { name: 'South Dakota', abbreviation: 'SD', capital: 'Pierre', region: 'Midwest' },
  { name: 'Tennessee', abbreviation: 'TN', capital: 'Nashville', region: 'South' },
  { name: 'Texas', abbreviation: 'TX', capital: 'Austin', region: 'South' },
  { name: 'Utah', abbreviation: 'UT', capital: 'Salt Lake City', region: 'West' },
  { name: 'Vermont', abbreviation: 'VT', capital: 'Montpelier', region: 'Northeast' },
  { name: 'Virginia', abbreviation: 'VA', capital: 'Richmond', region: 'South' },
  { name: 'Washington', abbreviation: 'WA', capital: 'Olympia', region: 'West' },
  { name: 'West Virginia', abbreviation: 'WV', capital: 'Charleston', region: 'South' },
  { name: 'Wisconsin', abbreviation: 'WI', capital: 'Madison', region: 'Midwest' },
  { name: 'Wyoming', abbreviation: 'WY', capital: 'Cheyenne', region: 'West' },
];

async function seedStates() {
  console.log('🌱 Seeding US States...');

  try {
    // Check if states already exist
    const existingStatesCount = await prisma.state.count();
    
    if (existingStatesCount > 0) {
      console.log(`ℹ️  States already exist (${existingStatesCount} states found). Skipping seed.`);
      return;
    }

    // Insert all states
    const createdStates = await prisma.state.createMany({
      data: statesData,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully seeded ${createdStates.count} US states!`);

    // Display some stats
    const statesByRegion = await prisma.state.groupBy({
      by: ['region'],
      _count: {
        region: true,
      },
    });

    console.log('\n📊 States by Region:');
    statesByRegion.forEach(({ region, _count }) => {
      console.log(`   ${region}: ${_count.region} states`);
    });

  } catch (error) {
    console.error('❌ Error seeding states:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedStates();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  main();
}

export { seedStates };