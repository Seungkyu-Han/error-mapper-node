import { Type } from '@nestjs/common';
import { ErrorMappingDefinition } from '../types/error-definition.type';
import { Reflector } from '@nestjs/core';
import { MAP_ERROR } from '../symbols/map-error.symbol';
import { Handler } from '../types/handler-function.type';

export class ErrorCacheHelper {
  private readonly cache = new WeakMap<
    object,
    Map<Type<Error>, ErrorMappingDefinition>
  >();

  get(
    handler: Handler,
    error: Type<Error>,
    reflector: Reflector,
  ): ErrorMappingDefinition | undefined {
    let errorMap = this.cache.get(handler);

    if (!errorMap) {
      const definitions =
        reflector.get<ErrorMappingDefinition[]>(MAP_ERROR, handler) ?? [];

      errorMap = new Map(definitions.map((def) => [def.sourceError, def]));

      this.cache.set(handler, errorMap);
    }

    return errorMap.get(error);
  }
}
