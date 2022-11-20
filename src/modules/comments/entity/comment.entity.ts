import { Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { TaskCompletionEntity } from '../../tasks/entity/task-completion.entity';
import { InputUpdateCommentDto } from '../dto/input.update-comment.dto';

@Entity()
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => TaskCompletionEntity)
  taskCompletion: TaskCompletionEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Property()
  description: string;

  public updateProperties<T = InputUpdateCommentDto>(
    newData: T,
    fields: Array<keyof T>,
  ): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<TaskCompletionEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
