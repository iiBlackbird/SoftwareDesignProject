import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import type { Response } from 'express';

@Controller('admin/reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('volunteer-history/csv')
  async downloadVolunteerHistoryCSV(@Res() res: Response) {
    const csv = await this.reportService.generateVolunteerHistoryCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('volunteer_history.csv');
    res.send(csv);
  }

  @Get('volunteer-history/pdf')
  async downloadVolunteerHistoryPDF(@Res() res: Response) {
    const pdf = await this.reportService.generateVolunteerHistoryPDF();
    res.header('Content-Type', 'application/pdf');
    res.attachment('volunteer_history.pdf');
    res.send(pdf);
  }

  @Get('event-assignments/csv')
  async downloadEventAssignmentsCSV(@Res() res: Response) {
    const csv = await this.reportService.generateEventAssignmentCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('event_assignments.csv');
    res.send(csv);
  }

  @Get('event-assignments/pdf')
  async downloadEventAssignmentsPDF(@Res() res: Response) {
    const pdf = await this.reportService.generateEventAssignmentPDF();
    res.header('Content-Type', 'application/pdf');
    res.attachment('event_assignments.pdf');
    res.send(pdf);
  }
}
