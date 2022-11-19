import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class InputPaginationDto {
  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @ApiProperty({ required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @ApiProperty({ required: false, minLength: 1, maxLength: 64 })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  search?: string;

  @ApiProperty({ required: false, minLength: 4, maxLength: 64 })
  @IsOptional()
  @IsString()
  @Length(4, 64)
  sort?: string;
}
