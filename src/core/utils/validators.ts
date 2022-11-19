import { FileValidator, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FileTypes } from '../enums/file-types.enum';
import { getFileTypeFromMime } from './utils';

export function NoWhiteSpace(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'NoWhiteSpace',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NoWhiteSpaceRule,
    });
  };
}

@ValidatorConstraint({ name: 'NoWhiteSpace' })
@Injectable()
export class NoWhiteSpaceRule implements ValidatorConstraintInterface {
  constructor() {}

  validate(value: string) {
    if (value.match(/[\s\t\n]/)) {
      return false;
    }

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} must not contain whitespace`;
  }
}

export function IsEnum(data: any, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEnumCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: data,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const includes = (val) => !!Object.values(data).find((v) => v == val);
          if (Array.isArray(value)) {
            return !!value.some(includes);
          }
          return !!includes(value);
        },
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must be one of: ${Object.values(data).join(', ')}`,
      },
    });
  };
}

export function IsColorValue(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isColorValue',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          console.log('validatingggg');
          return new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).test(value);
        },
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must be valid hexadecimal color`,
      },
    });
  };
}

export function IsArray(type: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isArrayCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [type],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            Array.isArray(value) && !value.find((el) => !(typeof el == type))
          );
        },
        defaultMessage: (args: ValidationArguments) =>
          `elements of ${args.property} array must be one of type: ${type}`,
      },
    });
  };
}

export function CombinedLength<T = any>(
  fields: Array<keyof T>,
  maxLength: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, property: any) {
    registerDecorator({
      name: 'isArrayCustom',
      target: object.constructor,
      propertyName: property,
      constraints: [fields],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            fields.reduce(
              (prev, next) => prev + (args.object as any)[next]?.length,
              0,
            ) < maxLength
          );
        },
        defaultMessage: (args: ValidationArguments) =>
          `max combined length of fields ${fields
            .map((f) => `"${f.toString()}"`)
            .join(', ')} is ${maxLength}`,
      },
    });
  };
}

@Injectable()
export class FileTypeValidator extends FileValidator {
  buildErrorMessage(): string {
    return `Filetype not allowed, allowed types are: ${this.options.allowedTypes}`;
  }

  constructor(private options: { allowedTypes: FileTypes[] }) {
    super(options);
  }

  isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
    console.log(file?.mimetype);
    return (
      !!getFileTypeFromMime(file.mimetype, this.options.allowedTypes) ||
      file?.mimetype == 'application/octet-stream'
    );
  }
}
