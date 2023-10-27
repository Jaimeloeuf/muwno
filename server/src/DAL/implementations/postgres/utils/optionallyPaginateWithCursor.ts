/**
 * Utility function to combine query args with cursor pagination config
 * if needed while still retaining a narrow type for `findMany` to
 * properly infer the return type when doing queries with relation.
 *
 * References:
 * https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
 * https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb
 */
export const optionallyPaginateWithCursor = <T, U, V>(
  optionalPaginationID: T | undefined,
  queryArgs: U,
  cursor: V,
  skip = 1, //  Default to skip the cursor (1 row)
) =>
  optionalPaginationID === undefined
    ? queryArgs
    : { ...queryArgs, cursor, skip };
