import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';
import { InputPaginationDto } from 'src/core/dto/input.pagination.dto';

export class InputTaskComplitionPaginationDto extends InputPaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  rated?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  taskId?: number;
}
