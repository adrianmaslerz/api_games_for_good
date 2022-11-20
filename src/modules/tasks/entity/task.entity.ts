import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../core/entity/base.entity';
import { InputCreateTaskDto } from '../dto/input.create-task.dto';

export enum TaskType {
  TASK = 'task',
  MISSION = 'mission',
}

@Entity()
export class TaskEntity extends BaseEntity {
  @Property()
  name: string;

  @Enum(() => TaskType)
  type: TaskType;

  @ManyToOne({
    nullable: true,
  })
  parent?: TaskEntity;

  @Property({
    nullable: true,
  })
  logo?: string;

  @Property()
  description: string;

  @Property()
  color: string;

  @Property({
    default: 0,
  })
  points: number;

  @Property({
    nullable: true,
  })
  date?: Date;

  @Property()
  knowledgePill: string;

  @Property({
    default: false,
  })
  recurring: boolean;

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
