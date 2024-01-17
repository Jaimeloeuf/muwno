# How to deploy
This documents the steps to deploy all the parts of this monorepo.


## Server
### Build + Deployment Steps
This steps is specifically for using `GCP Cloud Run` with a local build step.
1. Run `npm run build` to build a dirty build using local project source files.
1. Note that Docker build must be the linux/amd64 platform to run properly on platforms like `GCP Cloud Run`
    1. Especially as building on Apple Silicon Macs will use Arm as target platform by default instead.
1. Build the docker image using either
    1. `npm run docker:clean-build;`
        - Prefer this for a clean build without using any cache.
    1. `npm run docker:build;`
1. Push docker image to container registry, e.g. `GCP Container Registry`
    - `npm run docker:push`
1. Make sure env var is set properly in cloud provider.
1. Deploy new instance of service with the new Docker image.
1. Verify that it works.

Combined command to build server, build image and run image locally to test.
- `npm run build; npm run docker:build; npm run docker:run-attached`
- `npm run build; npm run docker:clean-build; npm run docker:run-attached`


## Frontend
1. All 3 frontends (app, form, landing) are hosted on [Vercel](https://vercel.com/).
1. All 3 use Vercel's CICD pipeline triggered by changes on the git repo
1. Vercel uses `prod` branch for production and every other branch (mainly master) for previews.

### Deployment Steps
1. Make sure all env var is set properly in Vercel.
    1. Ensure that the env var used is prod env var and not testing env vars!
    1. If env vars are updated manually, remember to re build+deploy again in Vercel dashboard for it to use the new env vars.
1. Assuming changes to deploy are already on the `master` branch, fast forward the `prod` branch to it.
    1. Point `git HEAD` to `prod` (merge-receiving branch)
        1. Use `git status` to check what is HEAD pointing to now.
        1. If not pointing to `prod`, use `git checkout prod` to switch branch.
            1. If needed, stash all changes before switching branch. E.g. `git stash --include-untracked`
    1. Fast forward `prod` branch to `master` branch latest.
        1. Use `git merge master` to merge `master` into `prod`.
    1. Push `prod` branch to origin.
        1. Use `git push origin prod`.
1. Verify on Vercel dashboard / Github that it is deployed.
1. Change branch back to `master` or whichever working branch to ensure you do not work on `prod` branch directly.



## Stripe Integration
### Deployment Steps
1. Setup stripe using the CLI script to create products and pricing objects
    1. cd into /server/ to run the npm script.
    1. [`npm run stripe:setup`](../server/scripts/stripe/README.md)
1. Add stripe webhook endpoints and point to the deployed backend URL
    1. <https://dashboard.stripe.com/webhooks/create?endpoint_location=hosted>
1. Make sure this is saved for the billing portal link to work
    1. https://dashboard.stripe.com/test/settings/billing/portal
1. Create coupons as needed.