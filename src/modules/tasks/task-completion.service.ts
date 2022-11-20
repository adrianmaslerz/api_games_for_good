import { EntityRepository } from '@mikro-orm/postgresql';
import { FindOneOptions, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FileTypes } from 'src/core/enums/file-types.enum';
import { UploadService } from '../upload/upload.service';
import { UserEntity } from '../user/entity/user.entity';
import {
  TaskCompletionEntity,
  TaskCompletionStatus,
} from './entity/task-completion.entity';
import { OutputPaginationDto } from 'src/core/dto/output.pagination.dto';
import { handleNotFound, pagination } from 'src/core/utils/utils';
import { FilterQuery } from '@mikro-orm/core';
import { InputUpdateTaskCompletionDto } from '../tasks/dto/input.update-task-completion.dto';
import { InputTaskComplitionPaginationDto } from '../tasks/dto/input.task-completion-pagination.dto';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entity/task.entity';
import { InputCompleteTaskDto } from './dto/input.complete-task.dto';
import { OutputLeaderboardDto } from './dto/output.leaderboard.dto';
import { UserService } from '../user/user.service';
import { throws } from 'assert';

@Injectable()
export class TaskCompletionService {
  constructor(
    private microORM: MikroORM,
    private uploadService: UploadService,
    @Inject(forwardRef(() => TasksService))
    private taskService: TasksService,
    @InjectRepository(TaskCompletionEntity)
    private readonly taskCompletionRepository: EntityRepository<TaskCompletionEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: EntityRepository<TaskEntity>,
    private userService: UserService,
  ) {}

  public async completeTask(
    user: UserEntity,
    task: TaskEntity,
    files: Express.Multer.File[],
    data: InputCompleteTaskDto,
  ) {
    const hasSubtasks =
      (await this.taskRepository
        .createQueryBuilder('task')
        .leftJoin(`task.completions`, 'completions')
        .leftJoin('completions.user', 'user')
        .where(`"completions"."status" <> '${TaskCompletionStatus.ACCEPTED}'`)
        .andWhere(`"user"."id" = ${user.id}`)
        .getCount()) > 0;

    if (hasSubtasks) {
      throw new ConflictException("You can't complete this task without ");
    }
    const exists = await this.findOne({ task, user }, false);
    if (exists) {
      throw new ConflictException('Task already completed');
    }

    const uploadedFiles = await Promise.all(
      (files || []).map((file) =>
        this.uploadService.save('tasks', file, FileTypes.IMAGE),
      ),
    );
    const result = this.taskCompletionRepository.create({
      uploadedFiles,
      user,
      task,
      ...data,
    });
    await this.taskCompletionRepository.persistAndFlush(result);
    return result;
  }

  public async findAll(
    filters: InputTaskComplitionPaginationDto,
  ): Promise<OutputPaginationDto<any>> {
    console.log(filters);
    const query =
      this.taskCompletionRepository.createQueryBuilder('completion');
    query.leftJoinAndSelect('completion.user', 'user');
    query.leftJoinAndSelect('completion.uploadedFiles', 'uploadedFiles');
    if (filters.rated === false) {
      query.where({ points: null });
    }
    if (filters.rated === false) {
      query.where({ points: { $not: null } });
    }
    if (filters.taskId) {
      query.andWhere({ task: { id: filters.taskId } });
    }
    return pagination(filters, query, [], { default: 'completion.id' });
  }

  async findOne(
    filter: FilterQuery<TaskCompletionEntity>,
    handleNotFoundError = true,
    options?: FindOneOptions<TaskCompletionEntity>,
  ): Promise<TaskCompletionEntity> {
    const completion = await this.taskCompletionRepository.findOne(
      filter,
      options,
    );
    if (handleNotFoundError) {
      handleNotFound('task completion', completion);
    }
    return completion;
  }

  async update(
    id: number,
    data: InputUpdateTaskCompletionDto,
  ): Promise<TaskCompletionEntity> {
    const completion = await this.findOne({ id });
    completion.updateProperties(data, ['points']);
    await this.taskCompletionRepository.flush();
    return completion;
  }

  async setStatus(id: number, status: TaskCompletionStatus) {
    const completion = await this.findOne({ id }, true, {
      populate: ['task'] as any,
    });
    completion.status = status;
    await this.userService.addPoints(
      completion.user.id,
      -completion.points + completion.task.points,
    );
    completion.points =
      status == TaskCompletionStatus.ACCEPTED ? completion.task.points : 0;

    await this.taskCompletionRepository.flush();
    return completion;
  }

  async getLeaderBoard(taskId: number): Promise<OutputLeaderboardDto> {
    const knex = this.taskRepository.getKnex();

    //get subtasks with recursive join
    const allSubtasks = await knex
      .withRecursive('tree', (qb) => {
        qb.select(['task_entity.id', 'task_entity.parent_id'])
          .from('task_entity')
          .where('task_entity.id', taskId)

          .union((qb) => {
            qb.select(['task_entity.id', 'task_entity.parent_id'])
              .from('task_entity')
              .join('tree', 'tree.id', 'task_entity.parent_id');
          });
      })
      .select(['tree.id', 'tree.parent_id'])
      .from('tree');

    //get user with points sum (raw query)
    const result = await this.taskCompletionRepository
      .createQueryBuilder('completion')
      .where({ task_id: { $in: allSubtasks.map((s) => s.id) } })
      .select(['sum(points) as points_sum'])
      .leftJoinAndSelect('completion.user', 'user')
      .groupBy('user.id')
      .getKnexQuery()
      .orderBy('points_sum', 'desc')
      .limit(1000);

    //map raw data back to user entity with points_sum field
    const users = result
      .map((el) => {
        const res = {};
        Object.keys(el).forEach((key) => {
          res[key.replace('user__', '')] = el[key];
        });
        return res;
      })
      .map((user) => ({
        ...this.microORM.em.map(UserEntity, user).serialize(),
        points_sum: user.points_sum,
      }));
    return users;
  }
}
