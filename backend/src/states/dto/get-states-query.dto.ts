import { IsString, IsOptional } from 'class-validator';

export class GetStatesQueryDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  search?: string;
}