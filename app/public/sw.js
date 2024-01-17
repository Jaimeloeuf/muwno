/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} self */

/**
 * Deploys a no-op service worker to replace a buggy service worker.
 * https://developer.chrome.com/docs/workbox/remove-buggy-service-workers/
 * https://www.ankursheel.com/blog/programmatically-remove-service-worker
 * https://stackoverflow.com/questions/33704791/how-do-i-uninstall-a-service-worker
 */
function noOpSW() {
  console.log("running noOpSW function");

  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.addEventListener("install", () => self.skipWaiting());

  self.addEventListener("activate", async () => {
    console.log(`Unregistering service worker`);
    await self.registration.unregister();

    // Get list of all the current open windows/tabs under our service worker's
    // control, and force them to reload. This can "unbreak" any open windows /
    // tabs as soon as the new service worker activates, rather than having
    // users manually reload.
    console.log(`Reloading windows under old SW's control`);
    self.clients
      .matchAll()
      .then((clients) =>
        clients.forEach((client) => client.navigate(client.url))
      );
  });
}

noOpSW();
