import { HttpErrorMappingDefinition } from '../types/http-error-definition.type';
import { MAP_HTTP_ERROR } from '../symbols/map-http-error.symbol';
import { MAP_ERROR } from '../symbols/map-error.symbol';
import { ErrorMappingDefinition } from '../types/error-definition.type';

export function MapError(
  definition: HttpErrorMappingDefinition,
): MethodDecorator;
export function MapError(definition: ErrorMappingDefinition): MethodDecorator;
export function MapError(definition: any): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    if ('status' in definition) {
      const existing: HttpErrorMappingDefinition[] =
        (Reflect.getMetadata(
          MAP_HTTP_ERROR,

          descriptor.value!,
        ) as HttpErrorMappingDefinition[]) ?? [];

      Reflect.defineMetadata(
        MAP_HTTP_ERROR,

        [...existing, definition],

        descriptor.value!,
      );
    } else if ('targetError' in definition) {
      const existing: HttpErrorMappingDefinition[] =
        (Reflect.getMetadata(
          MAP_ERROR,

          descriptor.value!,
        ) as HttpErrorMappingDefinition[]) ?? [];

      Reflect.defineMetadata(
        MAP_ERROR,

        [...existing, definition],

        descriptor.value!,
      );
    }
  };
}
