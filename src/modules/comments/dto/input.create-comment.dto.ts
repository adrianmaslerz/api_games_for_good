import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InputCreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  description: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'The $property is required.',
  })
  taskCompletion: string;
}
