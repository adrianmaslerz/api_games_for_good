import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class InputUpdateCommentDto {
  @ApiProperty()
  @IsOptional()
  description: number;
}
