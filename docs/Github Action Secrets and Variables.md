# Github Action Secrets / Variables
This documents all the Secrets and Variables needed to run the Github Action workflows.

## Secrets
### PROD_DATABASE_URL
This is the Direct database URL to the **Production** DB used for running Prisma migrations on it.
Add `?connect_timeout=10` to the end of the connection string to increase Prisma's timeout limit to 10 seconds since neon might take quite some time to boot up from cold start.

### STAGING_DATABASE_URL
This is the Direct database URL to the **Staging** DB used for running Prisma migrations on it.
Add `?connect_timeout=10` to the end of the connection string to increase Prisma's timeout limit to 10 seconds since neon might take quite some time to boot up from cold start.


## Variables