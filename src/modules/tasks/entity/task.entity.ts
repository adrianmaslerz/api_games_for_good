import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../core/entity/base.entity';
import { InputCreateTaskDto } from '../dto/input.create-task.dto';

@Entity()
export class TaskEntity extends BaseEntity {
  @Property()
  name: string;

  @Property()
  startDate: Date;

  @Property()
  endDate: Date;

  public updateProperties<T = InputCreateTaskDto>(
    newData: T,
    fields: Array<keyof T>,
  ): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<TaskEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
