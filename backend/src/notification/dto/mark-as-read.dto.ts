import { IsArray, IsInt, Min } from 'class-validator';

export class MarkAsReadDto {
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true }) //hardcode id=1
  notificationIds: number[];
}