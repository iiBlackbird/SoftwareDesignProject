import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportController', () => {
    let controller: ReportController;
    let service: ReportService;

    const mockReportService = {
        generateVolunteerHistoryCSV: jest.fn().mockResolvedValue('csv-content'),
        generateVolunteerHistoryPDF: jest.fn().mockResolvedValue(Buffer.from('pdf')),
        generateEventAssignmentCSV: jest.fn().mockResolvedValue('event-csv'),
        generateEventAssignmentPDF: jest.fn().mockResolvedValue(Buffer.from('event-pdf')),
    };

    const mockRes = () => {
        const res: any = {};
        res.header = jest.fn().mockReturnValue(res);
        res.attachment = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
      };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [ReportController],
        providers: [{ provide: ReportService, useValue: mockReportService }],
        }).compile();

        controller = module.get<ReportController>(ReportController);
        service = module.get<ReportService>(ReportService);
    });

    it('should return volunteer history CSV', async () => {
        const res = mockRes();
    
        await controller.downloadVolunteerHistoryCSV(res);
    
        expect(service.generateVolunteerHistoryCSV).toHaveBeenCalled();
        expect(res.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
        expect(res.attachment).toHaveBeenCalledWith('volunteer_history.csv');
        expect(res.send).toHaveBeenCalledWith('csv-content');
    });

    it('should return volunteer history PDF', async () => {
        const res = mockRes();
        await controller.downloadVolunteerHistoryPDF(res);
        expect(service.generateVolunteerHistoryPDF).toHaveBeenCalled();
        expect(res.header).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(res.attachment).toHaveBeenCalledWith('volunteer_history.pdf');
        expect(res.send).toHaveBeenCalledWith(Buffer.from('pdf'));
    })

    it('should return event assignments CSV', async () => {
        const res = mockRes();
    
        await controller.downloadEventAssignmentsCSV(res);
    
        expect(service.generateEventAssignmentCSV).toHaveBeenCalled();
        expect(res.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
        expect(res.attachment).toHaveBeenCalledWith('event_assignments.csv');
        expect(res.send).toHaveBeenCalledWith('event-csv');
    });
    
    it('should return event assignments PDF', async () => {
        const res = mockRes();
    
        await controller.downloadEventAssignmentsPDF(res);
    
        expect(service.generateEventAssignmentPDF).toHaveBeenCalled();
        expect(res.header).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(res.attachment).toHaveBeenCalledWith('event_assignments.pdf');
        expect(res.send).toHaveBeenCalledWith(Buffer.from('event-pdf'));
    });
})