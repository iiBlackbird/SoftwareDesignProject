import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createArrayCsvStringifier } from 'csv-writer';
import puppeteer from 'puppeteer';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getVolunteerHistory() {
    return this.prisma.volunteerHistory.findMany({
      include: { 
        user: true, 
        event: true 
      },
    });
  }

  async getEventAssignments() {
    return this.prisma.event.findMany({
      include: {
        volunteerHistories: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async generateVolunteerHistoryCSV(): Promise<string> {
    const records = await this.getVolunteerHistory();

    const transformed = records.map((r) => [
      r.user.fullName ?? 'N/A',
      r.event.name ?? 'N/A',
      r.event.description ?? '',
      r.event.location ?? '',
      r.event.requiredSkills.join(', '),
      r.event.urgency ?? '',
      r.event.eventDate?.toISOString().split('T')[0] ?? '',
      r.status ?? '',
    ]);

    const header = [
      'Volunteer',
      'Event',
      'Description',
      'Location',
      'Skills',
      'Urgency',
      'Date',
      'Status',
    ];

    const csv = createArrayCsvStringifier({ header });

    return csv.getHeaderString() + csv.stringifyRecords(transformed);
  }

  async generateVolunteerHistoryPDF(): Promise<Buffer> {
    const records = await this.getVolunteerHistory();

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Volunteer Activity Report</h1>
          <table>
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Event</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${records
                .map(
                  (r) => `
                <tr>
                  <td>${r.user.fullName ?? 'N/A'}</td>
                  <td>${r.event.name ?? 'N/A'}</td>
                  <td>${r.event.eventDate?.toISOString().split('T')[0] ?? ''}</td>
                  <td>${r.status ?? ''}</td>
                  <td>${r.event.description ?? ''}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdf);
  }

  async generateEventAssignmentCSV(): Promise<string> {
    const events = await this.getEventAssignments();

    const transformed = events.flatMap((event) =>
      event.volunteerHistories.map((vh) => [
        event.name,
        event.location,
        event.eventDate.toISOString().split('T')[0],
        vh.user.fullName ?? 'N/A',
        vh.status,
      ])
    );

    const header = [
      'Event',
      'Location',
      'Date',
      'Volunteer',
      'Status',
    ];

    const csv = createArrayCsvStringifier({ header });

    return csv.getHeaderString() + csv.stringifyRecords(transformed);
  }

  async generateEventAssignmentPDF(): Promise<Buffer> {
    const events = await this.getEventAssignments();

    const htmlRows = events
      .map((event) => {
        return event.volunteerHistories
          .map(
            (vh) => `
          <tr>
            <td>${event.name}</td>
            <td>${event.location}</td>
            <td>${event.eventDate.toISOString().split('T')[0]}</td>
            <td>${vh.user.fullName ?? 'N/A'}</td>
            <td>${vh.status}</td>
          </tr>
        `
          )
          .join('');
      })
      .join('');

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #2196F3; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Event Assignment Report</h1>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Location</th>
                <th>Date</th>
                <th>Volunteer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdf);
  }
}
