import { Type } from '@nestjs/common';

export interface HttpErrorDefinition {
  error: Type<Error>;
  status: number;
  message?: string;
}
