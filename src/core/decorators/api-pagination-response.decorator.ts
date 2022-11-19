import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginationResponse = <TModel extends Type<any>>({ description, type }: { description: string; type: TModel }) => {
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        properties: {
          total: {
            type: 'number',
          },
          results: {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
          },
        },
      },
    }),
  );
};
