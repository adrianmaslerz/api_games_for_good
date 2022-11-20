import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class InputCreateRewardDto {
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

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsInt()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  points: number;
}
