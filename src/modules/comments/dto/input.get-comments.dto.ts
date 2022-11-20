import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class InputGetCommentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  taskCompletion: string;
}
