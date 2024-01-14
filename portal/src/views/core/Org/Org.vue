<script setup lang="ts">
import { sf } from "simpler-fetch";
import { useOrg, useUser, useLoader, useError } from "../../../store";
import { OrgRoute, EditOrgRoute } from "../../../router";
import {
  getAuthHeader,
  getAbsoluteUrlFromRoute,
  prettyJSON,
  getDateString,
} from "../../../utils";
import TopNavbar from "../../shared/TopNavbar.vue";
import CopyOnClick from "../../shared/CopyOnClick.vue";
import RouteEnterButton from "../../shared/RouteEnterButton.vue";
import { Role } from "@domain-model";

const loader = useLoader();
const errorStore = useError();
const orgStore = useOrg();
const userStore = useUser();

const org = await orgStore.getOrg();
const user = await userStore.getUser();
const userIsAdmin = user.role === Role.OrgOwner || user.role === Role.OrgAdmin;

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

  if (err) {
    loader.hide();
    errorStore.newError(err);
    return;
  }

  if (!res.ok) {
    loader.hide();
    errorStore.newError(
      new Error(`Failed to open Stripe Billing Portal ${prettyJSON(res)}`)
    );
    return;
  }

  // Open link in current tab / redirect there since after that is done, user
  // will be redirected back to the portal.
  // Not hiding loader first because the stripe portal takes quite some time to
  // load and we don't want user to see our page with no changes after the
  // loader is hidden and wait.
  window.location.href = res.data;
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Organisation</TopNavbar>

    <div class="md:mx-12">
      <p class="pb-2 text-2xl">Details</p>

      <div class="mb-12 w-full max-w-md rounded-lg border border-zinc-200 p-3">
        <div class="pb-4">
          <div class="flex flex-row items-center gap-4">
            <p class="text-lg">Organisation ID</p>
            <CopyOnClick
              class="rounded-lg border border-zinc-200 bg-zinc-50 px-2 font-light text-zinc-900"
              :textToCopy="org.id"
            >
              Copy
            </CopyOnClick>
          </div>

          <p class="break-all font-light">
            {{ org.id }}
          </p>
        </div>

        <div class="pb-4">
          <p class="text-lg">Name</p>
          <p class="font-light">{{ org.name }}</p>
        </div>

        <div class="pb-4">
          <p class="text-lg">Admin Email</p>
          <p class="font-light">{{ org.email }}</p>
        </div>

        <div class="pb-4">
          <p class="text-lg">Admin Phone</p>
          <p class="font-light">{{ org.phone === "" ? "-" : org.phone }}</p>
        </div>

        <div class="pb-4">
          <p class="text-lg">Address</p>
          <p class="font-light">{{ org.address ?? "-" }}</p>
        </div>

        <div class="pb-4">
          <p class="text-lg">Status</p>
          <p class="font-light">
            {{ org.verified ? "Verified" : "Unverfied" }}
          </p>
        </div>

        <div class="pb-4">
          <p class="text-lg">Created On</p>
          <p class="font-light">{{ getDateString(org.createdAt) }}</p>
        </div>

        <RouteEnterButton v-if="userIsAdmin" :to="{ name: EditOrgRoute.name }">
          Edit Details
        </RouteEnterButton>
      </div>

      <div v-if="userIsAdmin">
        <p class="pb-2 text-2xl">Subscription</p>
        <button
          class="flex w-full max-w-md flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-lg font-light"
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
