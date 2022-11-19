import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { UploadedFileEntity } from './entity/uploaded-file.entity';
import { UploadService } from './upload.service';

@Module({
  imports: [MikroOrmModule.forFeature([UploadedFileEntity])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
