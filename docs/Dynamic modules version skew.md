# Dynamic modules version skew

## Context
1. Most of the frontend use SPA (Single Page Application) architecture.
1. All the SPA projects use dynamic imports for each of the routes so that the client only needs to load whats required for the current route for a faster experience.
1. Using build tools like `Vite`, every single JS module will have its content hash be part of its name, e.g. `login.8wig3v4l.js`. This is used to easily identify files that have changed and if cache needs to be updated and etc...
1. The router.js file of the build output holds the links to all of the app's pages.


## Version Skew Problem
1. Version Skew is a problem that occurs when a user that has already loaded the SPA holds an old version of the router.js file, where it references the old page links.
1. During this time, a new deployment is made, where all the old static resources are deleted and replaced with the new build outputs.
1. When the user tries to navigate to a page, the SPA router will attempt to load that page using the link to the JS module it has cached in the router.js file.
1. However since the old static resources have already been deleted, the client will get back a 404, which the SPA router will throw some sort of a `Failed to fetch dynamically imported module XYZ` error.
1. This problem is made worse by the git-ops based CICD paradigm, where every single new commit is deployed, which translates to multiple deployments every single day. This potentially means that users can face this issue quite often.


## Potential Solutions
1. The simplest way for users to resolve this issue themselves is to simply reload the page, which will get them the updated router.js file with the updated links to all of the pages, and when navigating there, load the correct module now.
1. Instead of getting users to manually reload their page, add an error handler to the router to look for this type of errors, and automatically navigate to the new URL and reload the page, so that on reload, it will be able to load the updated module correctly.
1. Do not delete old static resources, so that users on the older version of the app will still have everything work correctly, and they will automatically be "upgraded" to the latest version of the app whenever they reload the page.

Most solutions out there are usually a variation of the 3 or some combination of sorts. There are also paid services that handle this workflow like <https://vercel.com/blog/version-skew-protection>


## Choosen Solution
Solving it by adding an error handler to the router to look for this type of errors, and automatically navigate to the new URL and reload the page, so that on reload, it will be able to load the updated module correctly.

### Caveats
1. The SPA will lose its 'App like behavior' of no reloads, since user will experience a reload before their navigation takes place.
1. The SPA will lose any state.
    - This shouldn't be too much of an issue if at all, because all the pages should be created in such a way that does not rely on previous state, and load everything it needs when the page renders.

### Pros
1. Simplest solution without having to trouble users to reload.
1. Best tradeoff of solution simplicity and user experience.


## References
- [Simplified explanation of version skew issue](https://stackoverflow.com/questions/69300341/typeerror-failed-to-fetch-dynamically-imported-module-on-vue-vite-vanilla-set)
- [Explanation with Vite as context](https://github.com/vitejs/vite/issues/11804#issuecomment-1813789574)
-  Example of the solution mentioned
    - <https://mitchgavan.com/code-splitting-react-safely/>
    - <https://twitter.com/cpojer/status/1730141247900459166?t=yT1x3GDgin4uVW0oh1-Guw>
    - <https://gist.github.com/raphael-leger/4d703dea6c845788ff9eb36142374bdb>
- [Vite reference of this issue](https://github.com/vitejs/vite/issues/11804)
- [Vercel's explanation and their product as solution](https://vercel.com/blog/version-skew-protection)