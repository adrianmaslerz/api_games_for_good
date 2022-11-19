import { IsString, IsEmail, IsNotEmpty, Length, Contains } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NoWhiteSpace } from '../../../core/utils/validators';

export class InputRegisterDto {
  @ApiProperty({ minLength: 8, maxLength: 256 })
  @IsNotEmpty()
  @Length(8, 256)
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 6, maxLength: 64 })
  @IsNotEmpty()
  @Length(6, 64)
  @IsString()
  @NoWhiteSpace()
  readonly password: string;
}
