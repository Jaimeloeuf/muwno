# src/
Source files for the backend service.

## Files and Folders/
- [app](./app/)
    - Core of the application lives here.
    - This app module basically ties all feature module into 1.
- [config](./config/)
    - Code needed to configure the app with `@nestjs/config`
- [DAL](./DAL/)
    - Data Access Layer
- [exception-filters](./exception-filters/)
    - Exception filters defined for custom Service layer exceptions in [src/exceptions](./exceptions/) to convert them to HTTP Exceptions.
- [exceptions](./exceptions/)
    - Folder for common/shared custom exceptions thrown by the Service Layer. For each of the exceptions defined here, a corresponding exception-filter should be defined in [src/exception-filters](./exception-filters/).
- [global](./global/)
    - Global module used to tie together all modules that should be available in the global module scope.
- [infra](./infra/)
    - Standalone infrastructure layer services that communicate with external services and are not part of any feature module.
    - Persistence is implemented in its own Data Access layer following the repository pattern in [src/repository](./DAL/)
- [rbac](./rbac/)
    - Folder for all things used to implement Authorization with RBAC using JWTs.
- [throttler](./throttler/)
    - Folder for all things used to implement rate limiting to prevent DDOS attacks using the `@nestjs/throttler` package.
- [types](./types/)
    - Stores all types specific for this server/ subrepo only.
- [utils](./utils/)
    - Utility modules that do not fit in any other categories are grouped here.
- [main.ts](./main.ts)
    - Main module used to bootstrap the NestJS app.
- [root.module.ts](./root.module.ts)
    - Root of the NestJS module graph, where all other modules are registered directly or indirectly.