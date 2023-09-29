/**
 * Pagination ID is based off the fact that DB pagination needs to be
 * done on a ordered ID value. Yes this is the domain model and should
 * not be polluted with the implementation details but this is the
 * easiest way to share this type between the client and backend...
 */
export type PaginationID = number;
