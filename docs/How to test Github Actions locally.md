# How to test Github Actions locally?
[act](https://github.com/nektos/act) and docker is needed to emulate running github actions locally.


## How to run them locally
Run the workflow to run prisma migrations on staging DB
```sh
cls; sudo act push -W '.github/workflows/staging-prisma-migrate.yml' -s STAGING_DATABASE_URL
```

Run the workflow to run prisma migrations on production DB
```sh
cls; sudo act push -W '.github/workflows/prod-prisma-migrate.yml' -s PROD_DATABASE_URL
```

Notes:
- By using -s and the name of the secrets, act will require you to paste in the secrets in a secret input shell so that you wont leak it in shell history.
- If you face an issue with credentials on MacOS, you might need to delete 'creds store'
    - tldr; edit <~/.docker/config.json> to delete creds store
    - References
        - <https://stackoverflow.com/questions/71770693/error-saving-credentials-error-storing-credentials-err-exit-status-1-out>
        - <https://github.com/docker/docker-credential-helpers/issues/60>
        - <https://forums.docker.com/t/error-failed-to-solve-error-getting-credentials-err-exit-status-1-out/136124>
