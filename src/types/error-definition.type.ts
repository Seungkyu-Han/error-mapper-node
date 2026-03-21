import { Type } from '@nestjs/common';

export type ErrorMappingDefinition = {
  type: 'error';
  sourceError: Type<Error>;
  targetError: Type<Error>;
  message?: string;
};
