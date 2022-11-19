import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NoWhiteSpace } from '../../../core/utils/validators';

export class InputSetPasswordDto {
  @ApiProperty({ minLength: 6, maxLength: 256 })
  @IsNotEmpty()
  @Length(6, 256)
  @IsString()
  readonly token: string;

  @ApiProperty({ minLength: 6, maxLength: 64 })
  @IsNotEmpty()
  @Length(6, 64)
  @IsString()
  @NoWhiteSpace()
  readonly password: string;
}
