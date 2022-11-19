import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FileTypes } from 'src/core/enums/file-types.enum';
import { UploadService } from '../upload/upload.service';
import { UserEntity } from '../user/entity/user.entity';
import { TaskCompletionEntity } from './entity/task-completion.entity';
import { InputPaginationDto } from 'src/core/dto/input.pagination.dto';
import { OutputPaginationDto } from 'src/core/dto/output.pagination.dto';
import { handleNotFound, pagination } from 'src/core/utils/utils';
import { OutputTaskCompletionDto } from './dto/output.task-completion.dto';
import { FilterQuery } from '@mikro-orm/core';
import { InputUpdateTaskCompletionDto } from './dto/input.update-task-completion.dto';
import { InputTaskComplitionPaginationDto } from './dto/input.task-completion-pagination.dto';

@Injectable()
export class TaskCompletionService {
  constructor(
    private uploadService: UploadService,
    @InjectRepository(TaskCompletionEntity)
    private readonly taskCompletionRepository: EntityRepository<TaskCompletionEntity>,
  ) {}

  public async completeTask(
    user: UserEntity,
    task: { id: number },
    files: Express.Multer.File[],
  ) {
    const uploadedFiles = await Promise.all(
      files.map((file) =>
        this.uploadService.save('tasks', file, FileTypes.IMAGE),
      ),
    );
    const result = this.taskCompletionRepository.create({
      uploadedFiles,
      user,
    });
    await this.taskCompletionRepository.persistAndFlush(result);

    return result;
  }

  public async findAll(
    filters: InputTaskComplitionPaginationDto,
  ): Promise<OutputPaginationDto<any>> {
    const query =
      this.taskCompletionRepository.createQueryBuilder('completion');
    if (filters.rated === false) {
      query.where({ points: null });
    }
    if (filters.rated === false) {
      query.where({ points: { $not: null } });
    }
    return pagination(filters, query, [], { default: 'completion.id' });
  }

  async findOne(
    filter: FilterQuery<TaskCompletionEntity>,
  ): Promise<TaskCompletionEntity> {
    const completion = await this.taskCompletionRepository.findOne(filter);
    handleNotFound('task completion', completion);
    return completion;
  }

  async update(
    id: number,
    data: InputUpdateTaskCompletionDto,
  ): Promise<TaskCompletionEntity> {
    const completion = await this.findOne({ id });
    console.log(data);
    completion.updateProperties(data, ['points']);
    console.log(completion);
    await this.taskCompletionRepository.flush();
    return completion;
  }
}
