import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InputTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
