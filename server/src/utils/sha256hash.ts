import { createHash } from 'crypto';

export const sha256hash = (key: string) =>
  createHash('sha256').update(key).digest('base64url');
