import { Type } from '@nestjs/common';

export type HttpErrorMappingDefinition = {
  type: 'http';
  sourceError: Type<Error>;
  targetError: Type<Error>;
  message?: string;
};
