import { FilterQuery, MikroORM } from '@mikro-orm/core';
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
import { UploadService } from '../upload/upload.service';
import { FileTypes } from 'src/core/enums/file-types.enum';

@Injectable()
export class TasksService {
  constructor(
    private mikroORM: MikroORM,
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: EntityRepository<TaskEntity>,
    private uploadService: UploadService,
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
    const knex = this.tasksRepository.getKnex();
    const subquery = this.tasksRepository
      .createQueryBuilder('s')
      .select(['COUNT(s.id) as id'])
      .where({ parent_id: knex.ref('t.id') })
      .as('childrenCount');

    const query = this.tasksRepository.createQueryBuilder('t');

    query.select(['*', subquery]);

    query.andWhere({ parent: data.parent ? data.parent : null });

    if (Object.values(TaskType).includes(data.type)) {
      query.andWhere({ type: data.type });
    }

    const resultData = await query.execute();

    return resultData.map((el) => ({
      ...this.mikroORM.em.map(TaskEntity, el).serialize(),
      childrenCount: el.childrenCount,
    }));
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

  async addLogo(id: number, file: Express.Multer.File) {
    const task = await this.findOne({ id });
    const uploadedFile = await this.uploadService.save(
      'profile',
      file,
      FileTypes.IMAGE,
    );
    task.logo = uploadedFile;

    await this.tasksRepository.flush();
    return task;
  }
}
