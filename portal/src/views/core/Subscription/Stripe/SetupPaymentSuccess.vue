<script setup lang="ts">
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import { useOrg } from "../../../../store";
import { AllProductRoute } from "../../../../router";

const router = useRouter();
const orgStore = useOrg();

async function isSubscribed() {
  if (orgStore.orgDetails?.id === undefined)
    throw new Error(`Cannot check subscription status as Org cant be loaded`);

  const { res, err } = await sf
    .useDefault()
    .GET(`/subscription/status/${orgStore.orgDetails?.id}`)
    .useHeader(getAuthHeader)
    .runJSON<{ subscribed: boolean }>();

  if (err) throw err;
  if (!res.ok) throw new Error("Failed to load Tasks");

  if (res.data.subscribed) {
    // Start countdown to redirect to AllProduct page
    setTimeout(() => router.push({ name: AllProductRoute.name }), 5000);
  } else {
    // If not yet processed, check with API again in a second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return isSubscribed();
  }
}

await isSubscribed();
</script>

<template>
  <div class="mx-auto max-w-lg">
    <div class="mb-12">
      <p class="text-4xl font-light">Payment Success!</p>
    </div>

    <p class="mb-2 text-xl font-light">
      Redirecting to Products page in 5 seconds...
    </p>

    <router-link :to="{ name: AllProductRoute.name }">
      <div
        class="w-full rounded-lg bg-green-600 px-6 py-1 text-center text-2xl text-white"
      >
        Start
      </div>
    </router-link>
  </div>
</template>
