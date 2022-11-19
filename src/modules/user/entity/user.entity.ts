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
import { hashPassword } from '../../../core/utils/utils';
import { CreateUserDto } from '../dto/input.create-user.dto';

@Entity()
export class UserEntity extends BaseEntity {
  @Property({ unique: true })
  email: string;

  @Property({ hidden: true, default: null, nullable: true })
  @Exclude()
  password: string;

  @Enum({ items: () => Roles, default: Roles.USER })
  role: Roles = Roles.USER;

  @BeforeCreate()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = hashPassword(this.password);
    }
  }

  public updateProperties<T = CreateUserDto>(
    newData: T,
    fields: Array<keyof T>,
  ): void {
    super.updateProperties(newData, fields);
  }

  constructor(data: Partial<UserEntity>) {
    super();
    Object.assign(this, { ...this, ...data });
  }
}
