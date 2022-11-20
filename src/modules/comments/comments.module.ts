import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PassportModule } from '@nestjs/passport';
import { CommentEntity } from './entity/comment.entity';
import {TaskCompletionService} from "../tasks/task-completion.service";
import {TasksModule} from "../tasks/tasks.module";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [CommentEntity] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TasksModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
