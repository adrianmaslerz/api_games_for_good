import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class InputTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly token: string;
}
