import { Test, TestingModule } from '@nestjs/testing';
import { AdminEventsController } from './admin-events.controller';
import { AdminEventsService } from './admin-events.service';

describe('AdminEventsController', () => {
  let controller: AdminEventsController;
  let service: AdminEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminEventsController],
      providers: [
        {
          provide: AdminEventsService,
          useValue: {
            getUpcomingEvents: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminEventsController>(AdminEventsController);
    service = module.get<AdminEventsService>(AdminEventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUpcomingEvents', () => {
    it('should call service.getUpcomingEvents and return its result', async () => {
      const mockEvents = [{ id: '1', name: 'Event 1' }];
      (service.getUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

      const result = await controller.getUpcomingEvents();

      expect(service.getUpcomingEvents).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });
  });
});
