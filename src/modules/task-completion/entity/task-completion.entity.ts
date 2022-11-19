import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UploadedFile } from '@nestjs/common';
import { UploadedFileEntity } from 'src/modules/upload/entity/uploaded-file.entity';
import { InputUpdateTaskCompletionDto } from '../dto/input.update-task-completion.dto';

@Entity()
export class TaskCompletionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => UploadedFileEntity, 'taskCompletion', { nullable: true })
  uploadedFiles: UploadedFileEntity[];

  @Property({ nullable: true })
  points: number;

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
