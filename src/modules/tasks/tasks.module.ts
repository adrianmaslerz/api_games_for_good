import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskEntity } from './entity/task.entity';
import {PassportModule} from "@nestjs/passport";
import {TaskCompletionEntity} from "./entity/task-completion.entity";
import {TaskCompletionService} from "./task-completion.service";


@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaskEntity, TaskCompletionEntity] }),PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [TasksService, TaskCompletionService],
  controllers: [TasksController],
  exports: [TasksService, TaskCompletionService]
})
export class TasksModule {}
