import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { TaskEntity } from './entity/task.entity';
import { InputCreateTaskDto } from './dto/input.create-task.dto';
import { OutputPaginationDto } from '../../core/dto/output.pagination.dto';
import { OutputTaskDto } from './dto/output.task.dto';
import { handleNotFound, pagination } from '../../core/utils/utils';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: EntityRepository<TaskEntity>,
  ) {}

  async create(data: InputCreateTaskDto) {
    console.log("aaaa")
    const task = this.tasksRepository.create(data);
    await this.tasksRepository.persistAndFlush(task);
    return task;
  }

  async findAll(): Promise<OutputPaginationDto<OutputTaskDto>> {
    const query = this.tasksRepository.createQueryBuilder('tasks');
    const data = await pagination({ limit: 10, offset: 0 }, query, [], {
      default: 'tasks.id',
    });
    return data;
  }

  async findOne(filter: FilterQuery<TaskEntity>): Promise<TaskEntity> {
    const mission = await this.tasksRepository.findOne(filter);
    handleNotFound('tasks', mission);
    return mission;
  }

  async update(id: number, data: InputCreateTaskDto) {
    const mission = await this.tasksRepository.findOne({ id });
    handleNotFound('tasks', mission);
    mission.updateProperties(data, ['name', 'startDate', 'endDate']);
    await this.tasksRepository.flush();
    return mission;
  }

  async remove(id: number) {
    const mission = await this.tasksRepository.findOne({ id });
    handleNotFound('tasks', mission);
    await this.tasksRepository.removeAndFlush(mission);
    return true;
  }

  //for tests
  async truncate() {
    const knex = this.tasksRepository.getKnex();
    await knex.from('refresh_token_entity').where(knex.raw('true')).delete('*');
    await knex.from('mission_entity').where(knex.raw('true')).delete('*');
  }
}
