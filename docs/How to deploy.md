# How to deploy

## Frontend
1. All 3 frontends (portal, form, landing) are hosted on [Vercel](https://vercel.com/).
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