import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { TaskType } from '../entity/task.entity';

export class InputCompleteTaskDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  description: string;
}

export class InputCompleteTaskDtoWithFile extends InputCompleteTaskDto {
  @ApiProperty({ format: 'binary' })
  readonly files: Express.Multer.File[];
}
