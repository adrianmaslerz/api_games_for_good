import { Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../core/entity/base.entity';
import { InputCreateTaskDto } from '../dto/input.create-task.dto';
import { TaskCompletionEntity } from './task-completion.entity';

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

  @Exclude()
  @OneToMany(() => TaskCompletionEntity, 'task', { hidden: true })
  completions: TaskCompletionEntity[];

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
