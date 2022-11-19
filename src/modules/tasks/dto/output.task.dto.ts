import { ApiProperty } from '@nestjs/swagger';

export class OutputTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}
