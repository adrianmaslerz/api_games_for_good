import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Min } from 'class-validator';
import { Roles } from '../../../core/enums/roles.enum';
import { IsEnum, NoWhiteSpace } from '../../../core/utils/validators';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @NoWhiteSpace()
  @Min(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
