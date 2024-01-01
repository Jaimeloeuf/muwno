# Stale resources bug caused by old Service Worker
tl;dr Stale resources bug caused by unremoved old Service Worker that cached and responded with old resources.


## Bug Description
Users keep seeing an old version of the site even after new versions are available and they reload the page. This also lead to some broken pages when loading for resources that no longer exists.


## Initial problem diagnosis
1. Initially, I thought router caching was the issue, but this turned out to be false since on deploy the entire project is rebuilt.
    - My thoughts were to change the cache-control headers for vercel's CDN response to be something like `s-maxage=1` on /index.html so this is always up to date
    - If index.html is always up to date, then every single resource it links to will also stay up to date since they all use their dependencies' new hash.
1. Next I thought vite was not updating parent modules content that contains dynamic imports that changed, since there were some github issues mentioning this problem. But there wasn't really a solution for this and the suggested answers were either to build a plugin on top of vite to force regeneration of parent modules to let changes bubble up the request chain, or migrate back to Webpack...
1. Then I thought it was vercel's build caching that causes old content to be served. However this turned out to be wrong since vercel build cache is only for things like package-lock.json and node_modules/ meaning it was only caching the dependencies to save time on reinstalling dependencies on every build.
    - https://vercel.com/docs/deployments/troubleshoot-a-build#understanding-build-cache
    - https://vercel.com/docs/deployments/troubleshoot-a-build#managing-build-cache


## Root Cause
The problem is actually caused by a service worker caching outdated resources, and intercepting all requests to respond with the outdated resources.

The evidence for this is when looking at devtools on page load, the initial bunch of requests were all fulfilled by (ServiceWorker) as indicated in the Size section of Networking. And looking into the Application devtools, we can see the installed service worker from 'sw.js' installed in the past from around the time of PWA plugin removal is still cached and running. Looking at the source code of the service worker also shows the exact resources that it cached and from there can see that it is clearly out of date.

### What happened?
1. When the frontend projects were first created, they included the use of the [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) package. This installed a service worker that caches static resources so that the site can be used offline.
1. Since there was no valid usecase to support offline use of the sites, the package is removed.
1. Problem is that, simply removing the package and the service worker injection on page load does not mean that past users who visited the site and have a service worker installed will automatically uninstall/unregister/delete the service worker.
1. Because of this, the old service worker is always running on user's devices, which intercepted requests for the site and always served old content. So even when there was new content, for as long as the service worker intercepted requests to index.html or some top level resource, all subsequent child resources will attempt to load based on the older version of resource.
1. This is why there were situations where the page broke when it tries to request for an old resource from our hosting provider but it no longer exists since it was deleted when the new version was deployed.
1. This is also why only hard-reloading works, since hard-reload bypasses the service worker directly. And if they reloaded again after the hard-reload, it goes back to the service worker control, therefore using the old and stale resource again, causing the site to break once again even after it seemingly worked after a hard-reload.


## Solution
Remove service worker since it is not needed and serving stale content causing site to break.

### Part 1
If user somehow gets the fresh index.html, it will be able to load the fresh main.ts, which will run a script to always check and remove all service workers of the current scope, and reload the page if there is any service workers to ensure that the page breaks out of the service worker's control.

### Part 2
1. If user cant load fresh index.html because of service worker's cache behavior, browsers have a mechanism to check for new service worker after 24 hours from last SW use.
1. So using this mechanism, a new service worker is manually created in `sw.js` and hosted at the same location as the previously injected service worker.
1. Once the browser does its check and find the new service worker, which it will update to use it, and replace the old and buggy service worker.
1. The new service worker is a no-op service worker based on <https://developer.chrome.com/docs/workbox/remove-buggy-service-workers/> which will unregister itself and reload all tabs that are controlled by the service worker so that users can break free from the service worker's control.