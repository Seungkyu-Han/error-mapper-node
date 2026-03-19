import { HttpStatus, Type } from '@nestjs/common';
import { MAP_HTTP_ERROR } from '../symbols/map-http-error.symbol';
import { HttpErrorDefinition } from '../types/http-error-definition.type';

export function MapHttpError({
  error,
  status,
  message,
}: {
  error: Type<Error>;
  status: HttpStatus;
  message?: string;
}): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const existing: HttpErrorDefinition[] =
      (Reflect.getMetadata(
        MAP_HTTP_ERROR,
        descriptor.value!,
      ) as HttpErrorDefinition[]) ?? [];

    Reflect.defineMetadata(
      MAP_HTTP_ERROR,
      [...existing, { error, status, message }],
      descriptor.value!,
    );
  };
}
