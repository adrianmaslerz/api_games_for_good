import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import { TaskType } from '../entity/task.entity';

export class OutputTaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({
    nullable: true,
  })
  parent: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  @ApiProperty({
    enum: TaskType,
  })
  type: TaskType;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  points: number;

  @ApiProperty({
    nullable: true,
  })
  logo: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  knowledgePill: string;

  @ApiProperty()
  recurring: boolean;

  @ApiPropertyOptional()
  childrenCount: number;
}
