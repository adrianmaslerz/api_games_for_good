import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class InputUpdateTaskCompletionDto {
  @ApiProperty()
  @IsOptional()
  points: number;
}
