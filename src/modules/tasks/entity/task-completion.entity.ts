import { Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';

import { UploadedFileEntity } from 'src/modules/upload/entity/uploaded-file.entity';
import { InputUpdateTaskCompletionDto } from '../dto/input.update-task-completion.dto';
import { TaskEntity, TaskType } from './task.entity';

export enum TaskCompletionStatus {
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class TaskCompletionEntity extends BaseEntity {
  @ManyToOne(() => TaskEntity, { inversedBy: 'completions' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Property()
  description: string;

  @OneToMany(() => UploadedFileEntity, 'taskCompletion', { nullable: true })
  uploadedFiles: UploadedFileEntity[];

  @Property({ default: 0 })
  points: number;

  @Enum({ items: () => TaskCompletionStatus })
  status: TaskCompletionStatus = TaskCompletionStatus.SENT;

  public updateProperties<T = InputUpdateTaskCompletionDto>(
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
