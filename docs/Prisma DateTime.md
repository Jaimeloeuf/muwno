# Prisma DateTime
There are many DB fields stored as `Prisma DateTime type`, and this Prisma type maps to the `PostgreSQL timestamp(3)` type, which stores timestamp with milliseconds resolution.

The generated Prisma TS Models, will show the DateTime column field to be typed as a `Date`, as Prisma returns a native `Date` object by design.

Although the date can be converted to a ISO DateTime String by NestJS automatically during JSON serialization, it is better to rely on mapper functions to explicitly convert it as requrired by the DTOs before responding to the user's request, as by definition Date objects cannot cross the JSON serialization boundary but ISO DateTime Strings can.

If the frontend wants to use the native `Date` object, it would need to construct it with the ISO DateTime string.

This also means that if the backend is mapping a Prisma Model type to a Domain-Model type, it would need to manually convert all the native `Date` objects to ISO DateTime string first without relying on JSON serialization to do so.

To simplify the shared Domain Model types, all DateTime column fields are represented as the type `ISODateTimeString` which aliases the string type. The reason for doing this is to ensure that the types from Domain-Model are all perfectly serializable without causing any type changes.


## References
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON#description>
- <https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datetime>
- <https://github.com/prisma/prisma/discussions/5522>
- <https://github.com/prisma/prisma/issues/12540>