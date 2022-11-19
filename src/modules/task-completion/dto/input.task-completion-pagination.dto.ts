import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { InputPaginationDto } from 'src/core/dto/input.pagination.dto';

export class InputTaskComplitionPaginationDto extends InputPaginationDto {
  @ApiProperty()
  rated: boolean;
}
