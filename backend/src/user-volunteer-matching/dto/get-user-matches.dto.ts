import { IsInt, Min, IsOptional } from 'class-validator';

export class GetUserMatchesDto {
    @IsOptional()          // optional for now 
    @IsInt()
    @Min(1)
    userId?: number;
}