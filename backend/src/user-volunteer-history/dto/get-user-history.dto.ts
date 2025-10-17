import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetUserHistoryDto {
  // keep optional for now 
  @IsNumber()
  @IsOptional()
  @Min(1)
  userId?: number;
}

