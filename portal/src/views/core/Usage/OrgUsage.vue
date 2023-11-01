<script setup lang="ts">
import TopNavbar from "../../components/TopNavbar.vue";
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Organisation Usage</TopNavbar>

    <div class="mx-auto flex max-w-2xl flex-col gap-6">
      <p class="text-2xl font-light">
        Usage across entire Organisation this billing cycle
      </p>

      <div class="rounded-lg border border-zinc-200 p-6">
        <p>Responses processed</p>

        <p>{{}}</p>
      </div>

      <div class="rounded-lg border border-zinc-200 p-6">
        <p>Emails sent</p>

        <p>{{}}</p>
      </div>

      <div class="rounded-lg border border-zinc-200 p-6">
        <p>SMS sent</p>

        <p>{{}}</p>
      </div>

      <div class="rounded-lg border border-zinc-200 p-6">
        <p>Responses stored</p>

        <p>{{}}</p>
      </div>

      <div class="rounded-lg border border-zinc-200 p-6">
        <p>Customers stored</p>

        <p>{{}}</p>
      </div>

      <div class="py-3"></div>

      <!-- @todo Simplest way is to click and see in Stripe dashboard -->
      <!-- <div>
        <p>Estimated bill, {{}}</p>
      </div> -->
    </div>
  </div>
</template>
