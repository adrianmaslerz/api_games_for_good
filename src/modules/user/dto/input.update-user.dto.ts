import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Roles } from '../../../core/enums/roles.enum';
import { IsEnum, NoWhiteSpace } from '../../../core/utils/validators';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @NoWhiteSpace()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Roles)
  role: Roles;
}
