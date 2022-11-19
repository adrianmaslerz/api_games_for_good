import { Global, Module } from '@nestjs/common';
import { EmailService } from '../core/services/email.service';
import { UploadModule } from './upload/upload.module';

@Global()
@Module({
  imports: [UploadModule],
  providers: [EmailService],
  exports: [EmailService, UploadModule],
})
export class SharedModule {}
