BEGIN;

-- Replace all null values
UPDATE
  "org"
SET
  "phone" = ''
WHERE
  "phone" IS NULL;

-- This step will fail if there are existing NULL values in that column.
ALTER TABLE
  "org"
ALTER COLUMN
  "phone"
SET
  NOT NULL;

COMMIT;