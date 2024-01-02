<script setup lang="ts">
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import { useOrg } from "../../../../store";
import { AllProductRoute } from "../../../../router";
import RouteEnterButton from "../../../shared/RouteEnterButton.vue";

const router = useRouter();
const orgStore = useOrg();

async function isSubscribed() {
  const org = await orgStore.getOrg();

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
  <!--
    Negative margin is used to negate App.vue's default p-6 wrapping to ensure
    that when using h-screen there is no overscroll caused by the extra padding.
  -->
  <div class="-my-6 flex h-screen flex-col justify-center px-4">
    <div class="mx-auto max-w-sm">
      <div class="pb-2">
        <p class="text-4xl text-green-600">Success</p>
      </div>

      <p class="pb-4">
        Thank you for verifying your account! You will be redirected in 5
        seconds...
      </p>

      <RouteEnterButton
        :to="{ name: AllProductRoute.name }"
        class="text-green-600"
      >
        Start
      </RouteEnterButton>
    </div>
  </div>
</template>
