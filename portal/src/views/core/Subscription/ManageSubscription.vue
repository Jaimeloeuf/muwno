<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg, useLoader } from "../../../store";
import { ManageSubscriptionRoute } from "../../../router";
import SideDrawerButton from "../../components/SideDrawerButton.vue";
import { getAbsoluteUrlFromRoute } from "../../../utils/getAbsoluteUrlFromRoute";

const orgStore = useOrg();
const loader = useLoader();

const org = await orgStore.getOrg();

async function goToBillingPortal() {
  loader.show("Waiting for payment provider...");

  /** Redirect to this route on setup success */
  const returnUrl = encodeURIComponent(
    getAbsoluteUrlFromRoute(ManageSubscriptionRoute.name)
  );

  const { res, err } = await sf
    .useDefault()
    .POST(`/stripe/customer/create-portal-session?returnUrl=${returnUrl}`)
    .useHeader(getAuthHeader)
    .runText();

  // Dont really need to hide since they are redirected away, but just in case
  // something breaks they should not be stuck on the loading screen.
  loader.hide();

  if (err) throw err;
  if (!res.ok)
    throw new Error(
      `Failed to open Stripe Billing Portal ${JSON.stringify(res)}`
    );

  // Open link in current tab / redirect there since after that is done, user
  // will be redirected back to the portal.
  window.location.href = res.data;
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row border-b pb-4">
      <SideDrawerButton />
      <span class="ml-4 text-4xl">Manage Subscription</span>
    </div>

    <div class="mx-6 mb-10 border-b border-zinc-200 pb-6 md:mx-12">
      <p class="mb-2 text-xl">Org Details</p>

      <div class="flex flex-row items-center gap-6">
        <div class="rounded-lg border border-zinc-200 p-4">
          <p class="text-sm">Plan</p>

          <div class="text-right">
            <p class="text-4xl font-light">
              {{ org.plan }}
            </p>
          </div>
        </div>

        <div
          class="cursor-pointer rounded-lg border border-zinc-200 p-4"
          @click="goToBillingPortal"
        >
          <p class="text-sm">Manage your billing information</p>
          <p class="text-4xl font-light">Billing Portal</p>
        </div>
      </div>
    </div>

    <!-- @todo Add in things that must be done manually due to Billing Portal limitations -->

    <!-- @todo Cancel subscription -->
  </div>
</template>
