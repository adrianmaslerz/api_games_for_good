import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';
import { Roles } from '../../../core/enums/roles.enum';
import { IsEnum, NoWhiteSpace } from '../../../core/utils/validators';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @NoWhiteSpace()
  @Min(8)
  password: string;

  @ApiProperty({ enum: Roles })
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
