import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Roles } from '../../../core/enums/roles.enum';
import { BaseEntity } from '../../../core/entity/base.entity';
import { FileTypes } from 'src/core/enums/file-types.enum';

@Entity()
export class UploadedFileEntity extends BaseEntity {
  @Property()
  url: string;

  @Enum({ items: () => FileTypes })
  type: FileTypes;

  public updateProperties<T = any>(newData: T, fields: Array<keyof T>): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<UploadedFileEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
