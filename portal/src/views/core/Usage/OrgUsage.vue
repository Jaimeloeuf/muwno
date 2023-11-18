<script setup lang="ts">
import { flags } from "../../../utils/flags";
import TopNavbar from "../../shared/TopNavbar.vue";
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Organisation Usage</TopNavbar>

    <div class="mx-auto flex max-w-2xl flex-col gap-6">
      <p class="text-2xl font-light">
        Usage across entire Organisation this billing cycle
      </p>

      <div>
        <p>Responses processed</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div>
        <p>Responses stored</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div>
        <p>Customers stored</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div>
        <p>Emails sent</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div v-if="flags.devMode">
        <p>SMS sent</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div class="py-3"></div>

      <!-- @todo Simplest way is to click and see in Stripe dashboard -->
      <!-- <div>
        <p>Estimated bill, {{}}</p>
      </div> -->
    </div>
  </div>
</template>
