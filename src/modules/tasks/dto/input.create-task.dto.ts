import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { IsEnum } from '../../../core/utils/validators';
import { TaskType } from '../entity/task.entity';

export class InputCreateTaskDto {
  @ApiProperty({
    maxLength: 100,
  })
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  @MaxLength(100, {
    message: 'The $property should have maximum $constraint1 characters.',
  })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parent: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  description: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  color: string;

  @ApiProperty({
    enum: TaskType,
  })
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  @IsEnum(TaskType)
  type: TaskType;

  @ApiProperty()
  @IsDate()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsInt()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  points: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  knowledgePill: string;

  @ApiProperty()
  @IsOptional()
  recurring: string;
}
