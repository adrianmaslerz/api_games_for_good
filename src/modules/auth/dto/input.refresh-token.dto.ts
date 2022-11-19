import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InputRefreshTokenDto {
  @ApiProperty({ minLength: 8, maxLength: 512 })
  @IsNotEmpty()
  @Length(8, 512)
  @IsString()
  readonly refreshToken: string;
}
