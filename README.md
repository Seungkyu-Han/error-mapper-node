# Error Mapper for NestJS

[![NPM version](https://img.shields.io/npm/v/@seungkyu/error-mapper.svg?label=npm%20(stable))](https://npmjs.org/package/@seungkyu/error-mapper)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@seungkyu/error-mapper)
![npm downloads](https://img.shields.io/npm/dm/@seungkyu/error-mapper)
![license](https://img.shields.io/npm/l/@seungkyu/error-mapper)

A TypeScript library for NestJS that provides flexible error mapping from custom errors to response handlers.

## Installation

```shell
npm install @seungkyu/error-mapper
```

## Usage

### 1. Set global

Apply the interceptor globally so that error mapping works across all controllers and routes.

```ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MapHttpErrorInterceptor } from '@seungkyu/error-mapper';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);

    app.useGlobalInterceptors(new MapHttpErrorInterceptor(reflector));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```
### 2. Set scope

### Apply to specific controllers or routes

If you want to apply error mapping only to specific parts of your application, you can use `@UseInterceptors`.

```ts
@Controller()
@UseInterceptors(MapHttpErrorInterceptor)
export class AppController {
    constructor(private readonly appService: AppService) {}
}
```

### 3. Map Errors

Use the `@MapHttpError` decorator to define how specific errors should be transformed into HTTP responses.

```ts
import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MapHttpError, MapHttpErrorInterceptor } from '@seungkyu/error-mapper';

export class SeungkyuError extends Error {
    constructor() {
        super('SeungkyuError constructor');
    }
}

@Controller()
@UseInterceptors(MapHttpErrorInterceptor)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('seungkyu')
    @MapHttpError({
        error: SeungkyuError,
        status: HttpStatus.NOT_FOUND,
    })
    getHello(): string {
        throw new SeungkyuError();
        return this.appService.getHello();
    }
}
```

Configuration

| Option  | Type   | Required | Default                         | Description                                                      |
|---------|--------|----------|---------------------------------|------------------------------------------------------------------|
| error   | Error  | ✅        | -                               | Error class to match (e.g., `UserNotFoundError`)                 |
| status  | number | ✅        | -                               | HTTP status code returned when the error is thrown               |
| message | string | ❌        | error message in original error | Optional custom message (defaults to the original error message) |

## Example
### Using with Swagger

![request1.png](https://raw.githubusercontent.com/Seungkyu-Han/error-mapper-node/refs/heads/develop/request1.png)

### case1: Custom error message
![response1.png](https://raw.githubusercontent.com/Seungkyu-Han/error-mapper-node/refs/heads/develop/response1.png)

### case2: Default error message
![response2.png](https://raw.githubusercontent.com/Seungkyu-Han/error-mapper-node/refs/heads/develop/response2.png)

## Contact

- Email: [trust1204@gmail.com](mailto:trust1204@gmail.com)