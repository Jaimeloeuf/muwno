<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

const { loginWithRedirect } = useAuth0();

// @todo
// Seems like Auth0 will auto redirect user to universal login flow on page load
// even without any user interations, so this page is essentially not needed,
// and only used if user lands on this page but the Auth0 SDK does not redirect.
</script>

<template>
  <div>
    <button
      class="rounded-lg bg-slate-200 p-4 text-5xl"
      @click="loginWithRedirect()"
    >
      login
    </button>
  </div>
</template>
