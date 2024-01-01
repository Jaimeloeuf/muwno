function removeSW() {
  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      console.log(`Removing SWs...`);

      navigator.serviceWorker
        .getRegistrations()
        .then(async function (registrations) {
          for (const registration of registrations) {
            await registration.unregister();

            console.log(`Reloading sites controlled by SW...`);
            try {
              const clients = await self.clients.matchAll();
              clients.forEach((client) => {
                if (client.url && "navigate" in client) {
                  client.navigate(client.url);
                }
              });
            } catch (error) {
              console.error(`Failed to reload sites controlled by SW`);
              console.error(error);
            }
          }
        });
    }
  });
}

removeSW();
