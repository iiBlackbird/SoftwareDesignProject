import { Injectable } from '@nestjs/common';
import { volunteerHistory } from './mock-volunteer-history';

@Injectable()
export class VolunteerHistoryService {
    findAll() {
        return volunteerHistory;
    }
    findByVolunteer(name: string) {
        return volunteerHistory.filter(
            (record) =>
                record.volunteerName.toLowerCase() === name.toLowerCase()
        );
        
    }
}

