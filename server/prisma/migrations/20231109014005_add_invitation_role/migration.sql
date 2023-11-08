BEGIN;

-- Create nullable column
ALTER TABLE
    "team_member_invitation"
ADD
    COLUMN "role" "Role";

-- Replace all null values
UPDATE
    "team_member_invitation"
SET
    "role" = 'OrgUser'
WHERE
    "role" IS NULL;

-- This step will fail if there are existing NULL values in that column.
ALTER TABLE
    "team_member_invitation"
ALTER COLUMN
    "role"
SET
    NOT NULL;

COMMIT;