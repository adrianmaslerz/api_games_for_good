import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskEntity } from './entity/task.entity';
import {PassportModule} from "@nestjs/passport";
import {TaskCompletionService} from "./task-completion.service";
import {TaskCompletionEntity} from "./entity/task-completion.entity";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaskEntity, TaskCompletionEntity] }),PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [TasksService, TaskCompletionService],
  controllers: [TasksController],
})
export class TasksModule {}
