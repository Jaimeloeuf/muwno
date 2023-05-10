<template>
  <!-- Default/Fallback loader UI -->
  <div id="loader">
    <b style="font-size: 1.4em">... LOADING ...</b>
    <br />

    <!-- Spinner component made using CSS animations -->
    <div id="spinner" />
  </div>
</template>

<style scoped>
#loader {
  /* Flex grid CSS rules to make the loader component center horizontally and vertically */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /*
    Use a fixed position and high z-index so that the loader will not
    take up space on the normal plane and push other elements down/around.
  */
  position: fixed;

  /*
    Apply a high z index so that this appears over all other elements,
    and ensures that no other element can cover the loader while loader is shown.
    This also means that other components should not be using a z-index higher than 100
  */
  z-index: 100;

  /* Make the loading text and spinner aligned to the center of viewport */
  text-align: center;

  /* Force this to cover the whole view port */
  min-width: 100vw;
  min-height: 100vh;

  /* Right now, wo bg, then it is whatever is behind that zindex is shown */
  /* background-color: white; */
  /* Allow inherited attr for CSS class to be applied to this */
}

/* CSS to create a spinner using CSS animation */
#spinner {
  border: 0.3em solid #f3f3f3; /* Light grey */
  border-top: 0.3em solid #3498db; /* Blue */
  border-radius: 50%;
  width: 3em;
  height: 3em;
  animation: spin 1.6s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
