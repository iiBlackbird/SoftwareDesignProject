import { IsArray, IsInt, Min, IsString } from 'class-validator';



export class MarkAsReadDto {
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true }) //hardcode id=1
  @IsString()
  notificationIds: number[];
  notificationId: string;

}