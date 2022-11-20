import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { Roles } from '../../../core/enums/roles.enum';
import { BaseEntity } from '../../../core/entity/base.entity';
import { hashPassword } from '../../../core/utils/utils';
import { CreateUserDto } from '../dto/input.create-user.dto';
import { UploadedFile } from '@nestjs/common';
import { UploadedFileEntity } from 'src/modules/upload/entity/uploaded-file.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Property({ default: '' })
  username: string;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true, default: null, nullable: true })
  @Exclude()
  password: string;

  @Enum({ items: () => Roles, default: Roles.USER })
  role: Roles = Roles.USER;

  @ManyToOne(() => UploadedFileEntity, {
    nullable: true,
    serializer: (file) => file?.url,
  })
  profilePhoto: UploadedFileEntity;

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
