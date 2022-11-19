import { ApiProperty } from '@nestjs/swagger';

export class InputCompleteTaskDto {
  @ApiProperty()
  taskId: number;
}
