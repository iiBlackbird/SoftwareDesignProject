import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('pdf-file')),
    }),
    close: jest.fn(),
  }),
}));

describe('ReportService', () => {
  let service: ReportService;

  const mockPrisma = {
    volunteerHistory: {
      findMany: jest.fn().mockResolvedValue([
        {
          status: 'Completed',
          user: { fullName: 'John Smith' },
          event: {
            name: 'Cleanup',
            description: 'Beach cleanup',
            location: 'Miami',
            requiredSkills: ['Cleaning'],
            urgency: 'High',
            eventDate: new Date('2025-01-01'),
          },
        },
      ]),
    },
    event: {
      findMany: jest.fn().mockResolvedValue([
        {
          name: 'Cleanup',
          location: 'Miami',
          eventDate: new Date('2025-01-01'),
          volunteerHistories: [
            {
              user: { fullName: 'John Smith' },
              status: 'Completed',
            },
          ],
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should generate volunteer history CSV', async () => {
    const csv = await service.generateVolunteerHistoryCSV();

    expect(mockPrisma.volunteerHistory.findMany).toHaveBeenCalled();
    expect(csv).toContain('Volunteer,Event,Description');
    expect(csv).toContain('John Smith');
    expect(csv).toContain('Cleanup');
  });

  it('should generate volunteer history PDF', async () => {
    const pdf = await service.generateVolunteerHistoryPDF();

    expect(mockPrisma.volunteerHistory.findMany).toHaveBeenCalled();
    expect(pdf).toEqual(Buffer.from('pdf-file'));
  });

  it('should generate event assignment CSV', async () => {
    const csv = await service.generateEventAssignmentCSV();

    expect(mockPrisma.event.findMany).toHaveBeenCalled();
    expect(csv).toContain('Event,Location,Date');
    expect(csv).toContain('Cleanup');
    expect(csv).toContain('John Smith');
  });

  it('should generate event assignment PDF', async () => {
    const pdf = await service.generateEventAssignmentPDF();

    expect(mockPrisma.event.findMany).toHaveBeenCalled();
    expect(pdf).toEqual(Buffer.from('pdf-file'));
  });
});
