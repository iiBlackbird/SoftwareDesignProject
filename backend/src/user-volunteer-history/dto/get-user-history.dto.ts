import { IsOptional, IsString } from 'class-validator';

export class GetUserHistoryDto {
  @IsString()
  @IsOptional()
  userId?: string; 
}