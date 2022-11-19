import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType } from '../entity/task.entity';
import { IsOptional } from 'class-validator';

export class InputGetTasksDto {
  @ApiPropertyOptional({
    enum: TaskType,
  })
  @IsOptional()
  type: TaskType;

  @ApiPropertyOptional()
  @IsOptional()
  parent: string;
}
