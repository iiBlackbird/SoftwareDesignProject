import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetStatesQueryDto } from './dto/get-states-query.dto';

@Injectable()
export class StatesService {
  constructor(private prisma: PrismaService) {}

  async getAllStates(query?: GetStatesQueryDto) {
    try {
      const { region, search } = query || {};
      
      const where: any = {};
      
      if (region) {
        where.region = region;
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { abbreviation: { contains: search, mode: 'insensitive' } },
          { capital: { contains: search, mode: 'insensitive' } },
        ];
      }

      const states = await this.prisma.state.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      return {
        success: true,
        data: states,
        count: states.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch states: ${error.message}`);
    }
  }

  async getStateById(id: string) {
    try {
      const state = await this.prisma.state.findUnique({
        where: { id },
      });

      if (!state) {
        throw new Error('State not found');
      }

      return {
        success: true,
        data: state,
      };
    } catch (error) {
      throw new Error(`Failed to fetch state: ${error.message}`);
    }
  }

  async getStateByAbbreviation(abbreviation: string) {
    try {
      const state = await this.prisma.state.findUnique({
        where: { abbreviation: abbreviation.toUpperCase() },
      });

      if (!state) {
        throw new Error('State not found');
      }

      return {
        success: true,
        data: state,
      };
    } catch (error) {
      throw new Error(`Failed to fetch state: ${error.message}`);
    }
  }

  async getRegions() {
    try {
      const regions = await this.prisma.state.groupBy({
        by: ['region'],
        _count: {
          region: true,
        },
        orderBy: {
          region: 'asc',
        },
      });

      const formattedRegions = regions.map(({ region, _count }) => ({
        name: region,
        stateCount: _count.region,
      }));

      return {
        success: true,
        data: formattedRegions,
      };
    } catch (error) {
      throw new Error(`Failed to fetch regions: ${error.message}`);
    }
  }

  async seedStates() {
    try {
      // Check if states already exist
      const existingStatesCount = await this.prisma.state.count();
      
      if (existingStatesCount > 0) {
        return {
          success: true,
          message: `States already exist (${existingStatesCount} states found). Skipping seed.`,
        };
      }

      // States data array
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

      // Insert all states
      const createdStates = await this.prisma.state.createMany({
        data: statesData,
        skipDuplicates: true,
      });
      
      return {
        success: true,
        message: `Successfully seeded ${createdStates.count} US states!`,
      };
    } catch (error) {
      throw new Error(`Failed to seed states: ${error.message}`);
    }
  }
}