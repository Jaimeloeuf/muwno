# **/mapper
Folder for mapper functions to map Prisma Model types (data read from DB) to and from DTOs, to facilitate data exchange between the HTTP Controller layer and the Service / Business logic layer.

Prisma Model types are defined and stored in server/, while DTO types are stored in domain/ since DTO types are shared between the client and API service across the HTTP communication layer.

All the mappers are nested in the folders, `toDTOs` and `fromDTOs`, to mark if the mapper converts from DTO to a Prisma Model type or converts from a Prisma Model type to a DTO.