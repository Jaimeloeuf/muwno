# DB failure and recovery playbook
This playbook documents how to handle DB failures and how to recover from lost of data.


## Restoring lost data
Using Neon's Branching and PITR feature
1. Create a new branch, most likely using time stamp
1. Create a new compute unit for it and get the connection string
1. Use prisma/script with the new connection string to test if the data is restored / available
    1. If data is available, either
        1. (preferred option) use the API to point original compute unit to new branch
            - Then using the original connection string, test if the data is available again
            - This way means you dont have to change any env var of the running service
        1. Update server's env var to point to the new compute unit.
    1. If data is not available, restart and try creating branch at an earlier point in time.

### PITR references
- https://neon.tech/docs/guides/branching-pitr
    - general guide
- https://neon.tech/blog/point-in-time-recovery
    - see this for sample code on how to reuse the same compute unit for seamless fix


## DB Full backup and restoration
@todo


## Handling failed migrations
https://www.prisma.io/docs/guides/migrate/production-troubleshooting#fixing-failed-migrations-with-migrate-diff-and-db-execute