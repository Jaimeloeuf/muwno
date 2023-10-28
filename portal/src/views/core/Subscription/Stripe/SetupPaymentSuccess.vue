<script setup lang="ts">
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import { useOrg } from "../../../../store";
import { AllProductRoute } from "../../../../router";

const router = useRouter();
const orgStore = useOrg();

async function isSubscribed() {
  const org = await orgStore.getOrg();

  if (org.id === undefined)
    throw new Error(`Cannot check subscription status as Org cant be loaded`);

  const { res, err } = await sf
    .useDefault()
    .GET(`/subscription/status/${org.id}`)
    .useHeader(getAuthHeader)
    .runJSON<{ subscribed: boolean }>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(
      `Failed to get subscription status: ${JSON.stringify(res)}`
    );

  if (res.data.subscribed) {
    // Start countdown to redirect to AllProduct page
    const timerID = setTimeout(
      () => router.push({ name: AllProductRoute.name }),
      5000
    );

    // Clear timeout to prevent route change even when user navigated away
    // to somewhere else after AllProduct route.
    onUnmounted(() => clearTimeout(timerID));
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
