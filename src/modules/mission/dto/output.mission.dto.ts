import { ApiProperty } from '@nestjs/swagger';

export class OutputMissionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}
