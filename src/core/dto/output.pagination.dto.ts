import { ApiProperty } from '@nestjs/swagger';

export class OutputPaginationDto<T> {
  @ApiProperty()
  readonly total: number;

  readonly results: Array<T>;
}
