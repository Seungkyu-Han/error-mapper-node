import { Type } from '@nestjs/common';

export interface HttpErrorMappingDefinition {
  sourceError: Type<Error>;
  status: number;
  message?: string;
}
