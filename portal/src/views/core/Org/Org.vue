<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg, useLoader } from "../../../store";
import { OrgRoute } from "../../../router";
import { getAbsoluteUrlFromRoute } from "../../../utils/getAbsoluteUrlFromRoute";
import TopNavbar from "../../shared/TopNavbar.vue";
import CopyOnClick from "../../shared/CopyOnClick.vue";

const loader = useLoader();
const orgStore = useOrg();

const org = await orgStore.getOrg();

async function goToBillingPortal() {
  loader.show("Waiting for payment provider...");

  /** Redirect to this route on setup success */
  const returnUrl = encodeURIComponent(
    getAbsoluteUrlFromRoute({ name: OrgRoute.name })
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
    <TopNavbar sideDrawer>Organisation</TopNavbar>

    <div class="md:mx-12">
      <div class="pb-12">
        <p class="pb-2 text-2xl">Details</p>

        <div class="mb-4 w-full max-w-md rounded-lg border border-zinc-200 p-3">
          <p class="pb-2 text-xl">Name</p>
          <p>{{ org.name }}</p>
        </div>

        <div class="max-w-md rounded-lg border border-zinc-200 p-3">
          <p class="pb-2 text-xl">Organisation ID</p>
          <CopyOnClick>
            <p class="break-words font-extralight">
              {{ org.id }}
            </p>
            <p class="font-thin">Click to copy ID</p>
          </CopyOnClick>
        </div>
      </div>

      <div>
        <p class="pb-2 text-2xl">Subscription</p>
        <button
          class="flex w-full max-w-md flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-lg font-light"
          @click="goToBillingPortal"
        >
          Payment Details Portal

          <svg
            class="h-3 w-3 shrink-0 rotate-90 transition duration-150"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </div>

      <!-- @todo
        Add in things that must be done manually due to Billing Portal limitations
        - Cancel subscription
      -->
    </div>
  </div>
</template>
