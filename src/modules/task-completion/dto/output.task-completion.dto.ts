import { ApiProperty } from '@nestjs/swagger';
import { UploadedFileEntity } from 'src/modules/upload/entity/uploaded-file.entity';
import { OutputUserDto } from 'src/modules/user/dto/output.user.dto';
import { UserEntity } from 'src/modules/user/entity/user.entity';

export class OutputTaskCompletionDto {
  @ApiProperty()
  user: OutputUserDto;

  @ApiProperty()
  uploadedFiles: UploadedFileEntity[];

  @ApiProperty({ nullable: true })
  points: number;
}
