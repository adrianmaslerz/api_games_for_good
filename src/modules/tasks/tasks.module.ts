import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskEntity } from './entity/task.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaskEntity] })],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
