export const orgSizes = [
  '1 - 5',
  '6 - 10',
  '11 - 25',
  '26 - 50',
  '51 - 150',
  '151 - 500',
  '501 - 1000',
  'More than 1000',
] as const;

export type OrgSize = (typeof orgSizes)[number];
