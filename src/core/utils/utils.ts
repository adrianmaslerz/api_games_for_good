import * as crypto from 'crypto';
import { InputPaginationDto } from 'src/core/dto/input.pagination.dto';
import { knex, Knex, QueryBuilder } from '@mikro-orm/postgresql';
import { instanceToPlain } from 'class-transformer';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Roles } from '../enums/roles.enum';
import { ErrorMessages } from '../enums/error-messages.enum';
import { FileTypes } from '../enums/file-types.enum';

export const hashPassword = (password: string): string => crypto.createHmac('sha256', password).digest('hex');

export async function pagination<T extends object>(
  data: InputPaginationDto,
  query: QueryBuilder<T>,
  searchPossibilities: string[],
  sortPossibilities: { [key: string]: string; default: string },
): Promise<any> {
  if (data.search) {
    query.andWhere({
      $or: searchPossibilities.map((field) => {
        const row = {};
        row[field] = { $ilike: `%${data.search}%` };
        return row;
      }),
    });
  }
  const sortKey = sortPossibilities[data.sort?.split(':')[0] || 'default'];
  const sort = {};
  if (data.sort) {
    sort[sortKey] = data.sort.split(':')[1].toUpperCase();
    query.orderBy([sort]);
  } else {
    sort[sortKey] = 'ASC';
    query.orderBy([sort]);
  }
  if (data.limit) {
    query.offset(data.offset);
    query.limit(data.limit);
  }

  const results = (await query.getResultList()).map((el: any) => el.toPlain());
  const total = await query.clone().orderBy('').count();

  return { results, total };
}

export function parseCsv(content: string) {
  const result = [];
  const headings: string[] = [];
  content.split('\n').forEach((row, index) => {
    const rowObject = {};
    const items = row.split(';');
    items.forEach((item, itemIndex) => {
      if (index == 0) {
        headings.push(item);
        return;
      }
      rowObject[headings[itemIndex]] = item;
    });
    if (Object.entries(rowObject).length !== 0) {
      result.push(rowObject);
    }
  });
  return result;
}

export function updateProperties<T = any>(object: T, newData: any, fields: Array<keyof T>): T {
  fields.forEach((field) => {
    if (object[field] !== undefined && newData[field] !== undefined) {
      object[field] = newData[field];
    }
  });
  return object;
}

export function cleanupEntity(toRemove: string[], obj: any) {
  if (typeof obj == 'object') {
    for (const key in toRemove) {
      delete obj[key + 's'];
      delete obj[key + 'Id'];
    }
  }
  return obj;
}

export const handleNotFound = (objectName: string, data: any, throwError = true): void => {
  if (!data) {
    throw new BadRequestException(`${objectName.toLocaleLowerCase().replace(/^[a-z]/, (res) => res.toUpperCase())} not found`);
  }
};

export const handleForbidden = (user: UserEntity | undefined, object: any) => {
  if (user && user.role != Roles.ADMIN && object.user?.id != user.id) {
    throw new ForbiddenException(ErrorMessages.NOT_OWNER);
  }
};

export const filterByUser = (query: QueryBuilder<any>, user: UserEntity | undefined, alias: string) => {
  if (user && user.role != Roles.ADMIN) {
    query.join(`${alias}.user`, 'user', { user: { id: user.id } }, 'innerJoin');
  }
};

export const getFileTypeFromMime = (mime: string, allowedTypes: FileTypes[] = Object.values(FileTypes)): FileTypes | null => {
  const regex = new RegExp(allowedTypes.join('|'));
  const match = mime.match(regex);
  const type = match && match[0];
  return type as FileTypes;
};

export const insertManyToMany = async (knex: Knex, tableName: string, data: Record<string, number>[]): Promise<any> => {
  return knex.insert(data, '*').into(tableName).onConflict(Object.keys(data[0])).ignore();
};
