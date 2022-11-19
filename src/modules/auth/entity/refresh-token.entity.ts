import { UserEntity } from '../../../modules/user/entity/user.entity';
import { Exclude } from 'class-transformer';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class RefreshTokenEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Property()
  token: string;

  @Exclude()
  @Property()
  createdAt: Date = new Date();

  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }
}
