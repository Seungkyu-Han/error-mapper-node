import { Type } from '@nestjs/common';

export interface ErrorMappingDefinition {
  sourceError: Type<Error>;
  targetError: Type<Error>;
  message?: string;
}
