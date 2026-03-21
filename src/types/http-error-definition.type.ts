import { Type } from '@nestjs/common';

export type HttpErrorMappingDefinition = {
  type: 'http';
  sourceError: Type<Error>;
  status: number;
  message?: string;
};
