# DAL/implementations/postgres
Folder for all the concrete Data Repository implementations that implements the [Data Repository abstractions](../abstraction/) using PostgreSQL as the concrete data source and Prisma as the ORM.


## **/mapper.ts
Mapper functions nested in the repo folders to map Prisma Model types (data read from DB) to Domain Model Entities or DTOs, to facilitate data exchange between the Service / Business logic layer and the Data Access Repository layer.