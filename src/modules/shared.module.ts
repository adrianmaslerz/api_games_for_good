import { Global, Module } from '@nestjs/common';
import { EmailService } from '../core/services/email.service';

@Global()
@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class SharedModule {}
