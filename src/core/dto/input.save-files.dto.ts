import { ApiProperty } from '@nestjs/swagger';

export class InputSaveFilesDto {
  @ApiProperty({ format: 'binary' })
  readonly files: Express.Multer.File[];
}
