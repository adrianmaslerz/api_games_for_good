import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CommentEntity } from './entity/comment.entity';
import { InputCreateCommentDto } from './dto/input.create-comment.dto';
import { UserEntity } from '../user/entity/user.entity';
import { TaskCompletionEntity } from '../tasks/entity/task-completion.entity';
import {InputGetTasksDto} from "../tasks/dto/input.get-tasks.dto";
import {TaskType} from "../tasks/entity/task.entity";
import {pagination} from "../../core/utils/utils";
import {InputGetCommentsDto} from "./dto/input.get-comments.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: EntityRepository<CommentEntity>,
  ) {}

  async create(
    data: InputCreateCommentDto,
    user: UserEntity,
    taskCompletion: TaskCompletionEntity,
  ) {
    const comment = this.commentRepository.create({
      description: data.description,
      user,
      taskCompletion,
    });
    await this.commentRepository.persistAndFlush(comment);
    return comment;
  }

  async findAll(data: InputGetCommentsDto): Promise<any> {
    const query = this.commentRepository.createQueryBuilder('c');

    if (data.taskCompletion) {
      query.where({ taskCompletion: data.taskCompletion });
    }

    const results = await pagination({ limit: 10000, offset: 0 }, query, [], {
      default: 'c.id',
    });

    return results;
  }
}
