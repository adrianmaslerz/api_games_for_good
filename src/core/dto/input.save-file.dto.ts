import { ApiProperty } from '@nestjs/swagger';

export class InputSaveFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly file: Express.Multer.File;
}
