import { ApiProperty } from '@nestjs/swagger';

export class SuccessOutputDTO {
  @ApiProperty()
  status: boolean = true;
}
