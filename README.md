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
import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {MapErrorInterceptor} from '@seungkyu/error-mapper';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);

    app.useGlobalInterceptors(new MapErrorInterceptor(reflector));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

### 2. Set scope

### Apply to specific controllers or routes

If you want to apply error mapping only to specific parts of your application, you can use `@UseInterceptors`.

```ts

@Controller()
@UseInterceptors(MapErrorInterceptor)
export class AppController {
    constructor(private readonly appService: AppService) {
    }
}
```

### 3. Internal Error Mapping

Transform one error into another custom error

```ts
import {Controller, Get, UseInterceptors} from '@nestjs/common';
import {AppService} from './app.service';
import {MapErrorInterceptor, MapError} from '@seungkyu/error-mapper';

export class SeungkyuSourceError extends Error {
    constructor() {
        super('SeungkyuSourceError constructor');
    }
}

export class SeungkyuTargetError extends Error {
    constructor() {
        super('SeungkyuTargetError constructor');
    }
}

@Controller()
@UseInterceptors(MapErrorInterceptor)
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @MapError({
        sourceError: SeungkyuSourceError,
        targetError: SeungkyuTargetError,
        message: 'InternalSeungkyuError mapped to BadRequestException',
    })
    @Get('seungkyu')
    getHello(): string {
        throw new SeungkyuSourceError();
        return this.appService.getHello();
    }
}

```

Configuration

| Option      | Type   | Required | Default                         | Description                                                                                   |
|-------------|--------|----------|---------------------------------|-----------------------------------------------------------------------------------------------|
| sourceError | Error  | ✅        | -                               | The internal error class to match (e.g., UserNotFoundError).                                  |
| targetError | Error  | ✅        | -                               | The exception class to be thrown when the source error is caught (e.g., BadRequestException). |
| message     | string | ❌        | error message in original error | An optional custom message to override the original error message.                            |

### 4. HTTP Error Mapping

Transform error into HTTP response (HttpException)

```ts
import {Controller, Get, HttpStatus, UseInterceptors} from '@nestjs/common';
import {AppService} from './app.service';
import {MapErrorInterceptor, MapError} from '@seungkyu/error-mapper';

export class SeungkyuSourceError extends Error {
    constructor() {
        super('SeungkyuSourceError constructor');
    }
}

@Controller()
@UseInterceptors(MapErrorInterceptor)
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @MapError({
        sourceError: SeungkyuSourceError,
        status: HttpStatus.BAD_REQUEST,
        message: 'mapped to status',
    })
    @Get('seungkyu')
    getHello(): string {
        throw new SeungkyuSourceError();
        return this.appService.getHello();
    }
}

```

Configuration

| Option      | Type   | Required | Default                         | Description                                                      |
|-------------|--------|----------|---------------------------------|------------------------------------------------------------------|
| sourceError | Error  | ✅        | -                               | Error class to match (e.g., `UserNotFoundError`)                 |
| status      | number | ✅        | -                               | HTTP status code returned when the error is thrown               |
| message     | string | ❌        | error message in original error | Optional custom message (defaults to the original error message) |

## Example

### Using with Swagger

![request1.png](https://raw.githubusercontent.com/Seungkyu-Han/error-mapper-node/refs/heads/develop/request1.png)

### case1: Custom error message

![response1.png](https://raw.githubusercontent.com/Seungkyu-Han/error-mapper-node/refs/heads/develop/response1.png)

### case2: Default error message

![response2.png](https://raw.githubusercontent.com/Seungkyu-Han/error-mapper-node/refs/heads/develop/response2.png)

## Contact

- Email: [trust1204@gmail.com](mailto:trust1204@gmail.com)