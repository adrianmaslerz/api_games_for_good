import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../../core/entity/base.entity';
import { InputCreateMissionDto } from '../dto/input.create-mission.dto';

@Entity()
export class MissionEntity extends BaseEntity {
  @Property()
  name: string;

  @Property()
  startDate: Date;

  @Property()
  endDate: Date;

  public updateProperties<T = InputCreateMissionDto>(
    newData: T,
    fields: Array<keyof T>,
  ): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<MissionEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
