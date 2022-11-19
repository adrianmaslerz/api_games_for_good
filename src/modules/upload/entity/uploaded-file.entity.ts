import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Roles } from '../../../core/enums/roles.enum';
import { BaseEntity } from '../../../core/entity/base.entity';
import { FileTypes } from 'src/core/enums/file-types.enum';
import { TaskCompletionEntity } from 'src/modules/task-completion/entity/task-completion.entity';

@Entity()
export class UploadedFileEntity extends BaseEntity {
  @Property()
  url: string;

  @Enum({ items: () => FileTypes })
  type: FileTypes;

  @ManyToOne(() => TaskCompletionEntity, { hidden: true, nullable: true })
  taskCompletion: TaskCompletionEntity;

  public updateProperties<T = any>(newData: T, fields: Array<keyof T>): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<UploadedFileEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
