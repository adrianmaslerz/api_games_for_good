import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UploadedFileEntity } from '../../upload/entity/uploaded-file.entity';
import { InputCreateRewardDto } from '../dto/input.create-reward.dto';

@Entity()
export class RewardEntity extends BaseEntity {
  @Property()
  name: string;

  @ManyToOne(() => UploadedFileEntity, {
    nullable: true,
    serializer: (file) => file?.url,
  })
  logo?: UploadedFileEntity;

  @Property({
    nullable: true,
  })
  description?: string;

  @Property({
    default: 0,
  })
  points: number;

  public updateProperties<T = InputCreateRewardDto>(
    newData: T,
    fields: Array<keyof T>,
  ): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<RewardEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
