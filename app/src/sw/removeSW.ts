function removeSW() {
  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      console.log(`Removing SWs...`);

      navigator.serviceWorker
        .getRegistrations()
        .then(async function (registrations) {
          for (const registration of registrations)
            await registration.unregister();

          // Once all SWs are unregistered, reload so this page will be out of
          // the SWs control instead of waiting for user to manually reload.
          // Need to ensure that there is at least 1 SW being unregistered,
          // before reloading if not the user will be stuck in an infinite
          // reload loop since this script always runs.
          if (registrations.length > 0) {
            window.location.reload();
          }
        });
    }
  });
}

removeSW();
