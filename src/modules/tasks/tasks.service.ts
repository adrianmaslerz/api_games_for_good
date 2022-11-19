import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { TaskEntity, TaskType } from './entity/task.entity';
import { InputCreateTaskDto } from './dto/input.create-task.dto';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { OutputTaskDto } from './dto/output.task.dto';
import { handleNotFound, pagination } from '../../core/utils/utils';
import { InputGetTasksDto } from './dto/input.get-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: EntityRepository<TaskEntity>,
  ) {}

  async create(data: InputCreateTaskDto) {
    const task = this.tasksRepository.create(data);
    await this.tasksRepository.persistAndFlush(task);
    return task;
  }

  async findAll(
    data: InputGetTasksDto,
  ): Promise<OutputPaginationDto<OutputTaskDto>> {
    const query = this.tasksRepository.createQueryBuilder('tasks');
    query.andWhere({ parent: data.parent ? data.parent : null });

    if (Object.values(TaskType).includes(data.type)) {
      query.andWhere({ type: data.type });
    }

    return await pagination({ limit: 10000, offset: 0 }, query, [], {
      default: 'tasks.id',
    });
  }

  async findOne(
    filter: FilterQuery<TaskEntity>,
    handleNotFoundError = true,
  ): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne(filter);
    if (handleNotFoundError) {
      handleNotFound('tasks', task);
    }
    return task;
  }

  async update(id: number, data: InputCreateTaskDto) {
    const task = await this.tasksRepository.findOne({ id });
    handleNotFound('tasks', task);
    task.updateProperties(data, [
      'name',
      'date',
      'description',
      'color',
      'type',
      'parent',
      'points',
    ]);
    await this.tasksRepository.flush();
    return task;
  }

  async remove(id: number) {
    const task = await this.tasksRepository.findOne({ id });
    handleNotFound('tasks', task);
    await this.tasksRepository.removeAndFlush(task);
    return true;
  }
}
