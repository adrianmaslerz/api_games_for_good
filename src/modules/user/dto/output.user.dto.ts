import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../../core/enums/roles.enum';

export class OutputUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Roles })
  role: Roles;
}
