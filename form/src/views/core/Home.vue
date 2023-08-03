<script setup lang="ts">
// There is no home page for form/ so just redirect to landing page directly.
window.location.href = "https://thepmftool.com";
</script>

<template>
  <!--
    This will not be shown by default since the page will be redirected.
    However if for some reason/bug the page is not auto redirected away, users
    can still click the link to go to the landing page.
  -->
  <div class="flex h-screen flex-row items-center justify-center">
    <a
      href="https://thepmftool.com"
      class="rounded-lg bg-slate-200 px-6 py-2 text-4xl text-gray-500"
    >
      thepmftool.com
    </a>
  </div>
</template>
