import { ApiProperty } from '@nestjs/swagger';

export class OutputIdDto {
  @ApiProperty()
  readonly id: number;
}
