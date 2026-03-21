import { Type } from '@nestjs/common';

export interface ErrorMappingDefinition {
  type: 'error';
  sourceError: Type<Error>;
  targetError: Type<Error>;
  message?: string;
}
