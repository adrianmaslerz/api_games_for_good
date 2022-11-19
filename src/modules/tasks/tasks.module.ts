import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskEntity } from './entity/task.entity';
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaskEntity] }),PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
