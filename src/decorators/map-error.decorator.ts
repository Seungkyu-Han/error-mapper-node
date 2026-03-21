import { HttpErrorMappingDefinition } from '../types/http-error-definition.type';
import { ErrorMappingDefinition } from '../types/error-definition.type';
import { MAP_HTTP_ERROR } from '../symbols/map-http-error.symbol';
import { MAP_ERROR } from '../symbols/map-error.symbol';

type ErrorDefinition = ErrorMappingDefinition | HttpErrorMappingDefinition;

export function MapError(errorDefinition: ErrorDefinition): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    switch (errorDefinition.type) {
      case 'http': {
        const existing: HttpErrorMappingDefinition[] =
          (Reflect.getMetadata(
            MAP_HTTP_ERROR,
            descriptor.value!,
          ) as HttpErrorMappingDefinition[]) ?? [];

        Reflect.defineMetadata(
          MAP_HTTP_ERROR,
          [...existing, errorDefinition],
          descriptor.value!,
        );
        break;
      }

      case 'error': {
        const existing: ErrorMappingDefinition[] =
          (Reflect.getMetadata(
            MAP_ERROR,
            descriptor.value!,
          ) as ErrorMappingDefinition[]) ?? [];

        Reflect.defineMetadata(
          MAP_ERROR,
          [...existing, errorDefinition],
          descriptor.value!,
        );
        break;
      }
    }
  };
}
