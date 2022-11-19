import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class InputCreateMissionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
