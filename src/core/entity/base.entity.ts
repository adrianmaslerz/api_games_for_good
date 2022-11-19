import { Collection, Entity, PrimaryKey, Property, wrap } from '@mikro-orm/core';
import { instanceToPlain } from 'class-transformer';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property({ default: new Date().toISOString() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), default: new Date().toISOString() })
  updatedAt: Date = new Date();

  protected updateProperties<T = any>(newData: T, fields: Array<keyof T>) {
    fields.forEach((field) => {
      if ((this as any)[field] !== undefined && newData[field] !== undefined) {
        (this as any)[field] = newData[field];
      }
    });
  }

  public serialize() {
    return wrap(this).toObject();
  }

  public toPlain() {
    return instanceToPlain(this.serialize() as any);
  }
}
