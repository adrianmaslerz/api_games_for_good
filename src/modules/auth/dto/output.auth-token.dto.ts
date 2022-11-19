import { OutputUserDto } from '../../../modules/user/dto/output.user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OutputAuthTokensDto {
  @ApiProperty()
  readonly user: OutputUserDto;

  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly refreshToken: string;
}
