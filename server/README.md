# server
API server built with the [Nest](https://github.com/nestjs/nest) framework.


## Installation
```sh
npm install
```

Other than npm dependencies, `git` is also needed to be available in path for npm postbuild script to run.


## Create the .env file
Create a new [.env file](./.env) following this [env-sample](./env-sample) file.


## Running the app
Development mode (watch files and perform live reload)
```sh
npm run serve
```

Build and run in production mode
```sh
# Build app first before running the app
npm run build

# Run the build output
npm run start
```

Debug mode
```sh
npm run start:debug
```


## Deployment
Build docker image
```sh
npm run docker:build
```

Run docker image
```sh
npm run docker:run
```

Run docker image and attach it to current shell
```sh
npm run docker:run-attached
```


## Test
```sh
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```