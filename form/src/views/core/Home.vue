<script setup lang="ts">
import { landingLink } from "../../utils/links";

// There is no home page for form/ so just redirect to landing page directly.
window.location.href = landingLink;
</script>

<template>
  <!--
    This will not be shown by default since the page will be redirected.
    However if for some reason/bug the page is not auto redirected away, users
    can still click the link to go to the landing page.
  -->
  <div class="flex h-screen flex-row items-center justify-center">
    <a
      :href="landingLink"
      class="rounded-lg border border-zinc-200 bg-zinc-50 px-6 py-2 text-4xl"
    >
      muwno landing page
    </a>
  </div>
</template>
