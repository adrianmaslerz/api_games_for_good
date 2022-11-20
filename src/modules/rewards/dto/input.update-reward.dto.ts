import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class InputUpdateRewardDto {
  @ApiProperty({
    maxLength: 100,
  })
  @IsOptional()
  @MaxLength(100, {
    message: 'The $property should have maximum $constraint1 characters.',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()W
  @IsInt()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  points: number;
}
