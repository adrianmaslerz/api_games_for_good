import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InputEmailDto {
  @ApiProperty({ minLength: 8, maxLength: 256 })
  @IsNotEmpty()
  @Length(8, 256)
  @IsString()
  readonly email: string;
}
