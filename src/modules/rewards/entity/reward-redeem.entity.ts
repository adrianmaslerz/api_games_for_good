import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { RewardEntity } from './reward.entity';

@Entity()
export class RewardRedeemEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => RewardEntity)
  reward: RewardEntity;

  @Property({
    default: 0,
  })
  points: number;

  public updateProperties<T = any>(newData: T, fields: Array<keyof T>): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<RewardRedeemEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
