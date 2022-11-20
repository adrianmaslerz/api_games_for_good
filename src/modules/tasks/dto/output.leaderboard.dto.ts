import { ApiProperty } from '@nestjs/swagger';
import { OutputUserDto } from 'src/modules/user/dto/output.user.dto';

export class OutputLeaderboardDto extends OutputUserDto {
  @ApiProperty()
  points_sum: number;
}
