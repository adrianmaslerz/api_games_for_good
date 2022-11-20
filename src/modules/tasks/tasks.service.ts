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
import { TaskCompletionStatus } from './entity/task-completion.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: EntityRepository<TaskEntity>,
  ) {}

  async create(data: InputCreateTaskDto) {
    const task = this.tasksRepository.create({
      ...data,
      recurring: !!parseInt(data.recurring, undefined),
    });
    await this.tasksRepository.persistAndFlush(task);
    return task;
  }

  async findAll(data: InputGetTasksDto): Promise<any> {
    const children = (
      await this.tasksRepository
        .createQueryBuilder('t')
        .select(['COUNT(t.id) as id', 't.parent_id'])
        .where('t.parent_id IS NOT NULL')
        .groupBy(['t.parent_id'])
        .getResultList()
    ).map((el: any) => el.toPlain());

    const query = this.tasksRepository.createQueryBuilder('t');
    query.andWhere({ parent: data.parent ? data.parent : null });

    if (Object.values(TaskType).includes(data.type)) {
      query.andWhere({ type: data.type });
    }

    const results = await pagination({ limit: 10000, offset: 0 }, query, [], {
      default: 't.id',
    });

    results.results = results.results.map((result) => {
      return {
        ...result,
        childrenCount:
          children.find((child) => child.parent == result.id)?.id || 0,
      };
    });

    return results;
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
    task.updateProperties(
      {
        ...data,
        recurring: !!parseInt(data.recurring, undefined),
      },
      [
        'name',
        'date',
        'description',
        'color',
        'type',
        'parent',
        'points',
        'recurring',
        'knowledgePill',
      ],
    );
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
