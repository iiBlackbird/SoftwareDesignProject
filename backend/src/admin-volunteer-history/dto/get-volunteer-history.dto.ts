import { IsString, IsNotEmpty } from 'class-validator';

export class GetVolunteerHistoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}