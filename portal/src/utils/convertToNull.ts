/** Convert empty strings and undefined values to null */
export const convertToNull = (v: string | undefined) =>
  v === "" || v === undefined ? null : v;
