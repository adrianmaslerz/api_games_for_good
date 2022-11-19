import { ApiProperty } from '@nestjs/swagger';

export class OutputBaseEntityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
