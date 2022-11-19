import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TaskCompletionEntity } from './entity/task-completion.entity';
import { TaskCompletionController } from './task-completion.controller';
import { TaskCompletionService } from './task-completion.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TaskCompletionEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TaskCompletionController],
  providers: [TaskCompletionService],
  exports: [TaskCompletionService],
})
export class TaskCompletionModule {}
