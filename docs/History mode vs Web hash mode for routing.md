# History mode vs Web hash mode for routing
Why is History mode used instead of Web hash mode for routing on form/ and landing/?

Originally, form/ and landing/ both used web hash routing mode. However since these might not always be implemented as SPAs (Single Page Applications) and web hash mode does not work for SSR sites without a client router, I decided to switch it to History mode routing as early as possible to prevent any breaking links in the future.

## Why History mode?
1. SEO purposes for landing/ specifically.
1. Experimenting with Nuxt for landing/ shows that even though SSR sites built with tech like Nuxt does support web hash routing mode, it always sends the generated `/` home page first to the client regardless of the page they load. Which means that even though once the static HTML is loaded and the JS router takes over to change the router-view component, users will always end up seeing the Home page first, and it will have a flashing change effect to the actual route page (bad UX).

## Potential Caveat / Issues?
Need to ensure that hosting provider supports SPA history routing mode and always returns `index.html` on all routes. Which is currently supported by our frontend infra provider vercel.