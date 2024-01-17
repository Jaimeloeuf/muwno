/**
 * Response type can be anything since this utils function is just a wrapper
 * over JSON.stringify to prettify the JSON string output.
 */
export const prettyJSON = (res: unknown) => JSON.stringify(res, null, 2);
