import { Global, Module } from '@nestjs/common';
import { EmailService } from '../core/services/email.service';
import { UploadModule } from './upload/upload.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [UploadModule, UserModule],
  providers: [EmailService],
  exports: [EmailService, UploadModule, UserModule],
})
export class SharedModule {}
