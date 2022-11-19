import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from '../../../modules/user/entity/user.entity';

@Entity()
export class PasswordTokenEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Property()
  token: string;

  constructor(partial: Partial<PasswordTokenEntity>) {
    Object.assign(this, partial);
  }
}
