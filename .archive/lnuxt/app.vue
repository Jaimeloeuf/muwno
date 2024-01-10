<script setup lang="ts">
import { loader } from "./utils/loader";

// useSeoMeta({ ogImage: "/og-img.png" });
</script>

<template>
  <div>
    <!-- @todo
      For some reason this has to be ClientOnly else there would be hydration
      mismatches when loading the page and cause the links in sidedrawer to be
      out of the correct order.

      I originally thought it was because it was using fragments but even after
      wrapping it all in a div, it still didnt change until it is wrapped with
      this ClientOnly tag.
    -->
    <ClientOnly>
      <SideDrawer />
    </ClientOnly>

    <Loader v-if="loader.showLoader.value" />

    <Navbar />
    <NuxtPage />
    <Footer></Footer>
  </div>
</template>
