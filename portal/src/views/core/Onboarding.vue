<script setup lang="ts">
import { useRouter } from "vue-router";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase";
import {
  useTeamInvitation,
  useOrg,
  useOnboarding,
  useLoader,
  useNotif,
} from "../../store";
import {
  AllProductRoute,
  PendingInvitationRoute,
  CreateOrgRoute,
  BuySubscriptionPlanRoute,
  OnboardingRoute,
} from "../../router";
import { reloadPage } from "../../utils/reloadPage";
import { getAbsoluteUrlFromRoute } from "../../utils/getAbsoluteUrlFromRoute";
import { landingLink } from "../../utils/links";
import { logout } from "../../utils/logout";
import Accordion from "../shared/Accordion.vue";

const router = useRouter();
const onboardingStore = useOnboarding();

// If user already completed onboarding, ask them if they want to continue, else
// redirect to the main logged in view.
if (
  !(await onboardingStore.isOnboarding()) &&
  !confirm("You have already completed onboarding, start over?")
)
  router.push({ name: AllProductRoute.name });

const teamInvitationStore = useTeamInvitation();
const orgStore = useOrg();
const loader = useLoader();
const notif = useNotif();

await teamInvitationStore.checkForPendingTeamInvitations();

const hasPendingInvites = teamInvitationStore.invitations.length > 0;

// If user have an Org but still onboarding, it means that Org does not have a
// valid subscription right now, therefore show button to buy subscription plan
// for the Org instead of the Create Org button.
// Alternative way to get this value is by calling API to check if user's Org is
// missing payment/active subscription but this will do for now.
const orgWaitingForSubscription =
  (await orgStore.doesUserHaveOrg()) && (await onboardingStore.isOnboarding());

// Load the org name only if user have an Org, else this will error out
const orgName = orgWaitingForSubscription
  ? (await orgStore.getOrg()).name
  : undefined;

if (auth.currentUser === null) {
  throw new Error("Firebase Auth unable to load current user");
}

const faUser = auth.currentUser;

async function sendVerificationEmail() {
  loader.show();
  await sendEmailVerification(faUser, {
    url: getAbsoluteUrlFromRoute({ name: OnboardingRoute.name }),
  });
  loader.hide();
  notif.setSnackbar("Email sent!");
}
</script>

<template>
  <div>
    <a :href="landingLink" target="_blank">
      <img src="../../assets/logo.svg" class="h-8" />
      <p class="text-left font-semibold">Public Beta</p>
    </a>

    <div class="mx-auto max-w-xl">
      <p class="py-8 text-4xl">Welcome!</p>

      <div v-if="!faUser.emailVerified" class="pb-12">
        <div class="pb-6">
          <p class="pb-6 text-lg font-light">
            Please verify
            <span class="font-light italic underline underline-offset-4">{{
              faUser.email
            }}</span>
            by clicking the link we sent you.
          </p>

          <button
            class="w-full rounded-lg border border-green-600 p-2 text-xl text-green-600"
            @click="reloadPage"
          >
            I verified my email
          </button>
        </div>

        <Accordion>
          <template #summary>
            <p class="text-lg">I did not receive the email.</p>
          </template>

          <template #content>
            <p class="pb-4 font-light">Please check your spam folder too!</p>

            <button
              class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-light"
              @click="sendVerificationEmail"
            >
              Re-send verification email
            </button>
          </template>
        </Accordion>

        <Accordion>
          <template #summary>
            <p class="text-lg">Why?</p>
          </template>

          <template #content>
            <p class="font-light">
              By verifying your identity, you help us prevent bad actors from
              using our platform to scam or spam your customers, making it safer
              for you and your customers!
            </p>
          </template>
        </Accordion>
      </div>

      <div v-else class="pb-12">
        <router-link
          v-if="hasPendingInvites"
          :to="{ name: PendingInvitationRoute.name }"
        >
          <div
            class="mb-8 flex w-full flex-row items-center justify-between rounded-lg border border-green-600 p-3 text-green-600"
          >
            <p class="text-2xl">
              {{ teamInvitationStore.invitations.length }} Pending Invitation
            </p>

            <svg
              class="h-3 w-3 shrink-0 rotate-90"
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
          </div>
        </router-link>

        <router-link
          v-if="orgWaitingForSubscription"
          :to="{ name: BuySubscriptionPlanRoute.name }"
        >
          <div
            class="mb-8 flex w-full flex-row items-center justify-between rounded-lg border border-green-700 p-3 text-green-700"
          >
            <div>
              <p class="text-2xl">Activate {{ orgName }}</p>
              <p class="font-light">Subscribe to activate your Organisation.</p>
            </div>

            <svg
              class="h-3 w-3 shrink-0 rotate-90"
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
          </div>
        </router-link>

        <router-link v-else :to="{ name: CreateOrgRoute.name }">
          <div
            class="mb-8 flex w-full flex-row items-center justify-between rounded-lg border p-3"
            :class="{
              ' text-zinc-700': hasPendingInvites,
              'border-green-600 text-green-600': !hasPendingInvites,
            }"
          >
            <p class="text-2xl">Create an Organisation</p>

            <svg
              class="h-3 w-3 shrink-0 rotate-90"
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
          </div>
        </router-link>

        <Accordion v-if="!hasPendingInvites">
          <template #summary>
            <p class="text-xl">Joining an Organisation?</p>
          </template>

          <template #content>
            <p class="font-light">
              Join an existing Organisation by asking your Organisation Admin to
              invite you as a member in <i>Team &gt; Invite Member</i>.
            </p>
          </template>
        </Accordion>
      </div>

      <div class="pb-6">
        <p class="text-xl">Need Help?</p>
        <p>
          Reach out to us at
          <a
            class="font-light italic underline underline-offset-4"
            target="_blank"
            href="mailto:help@muwno.com"
          >
            help@muwno.com
          </a>
        </p>
      </div>

      <div
        class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 text-zinc-600"
        @click="logout(true)"
      >
        <span class="text-lg text-zinc-600">Logout</span>
        <img src="../../assets/SideDrawerIcon/logout.svg" class="h-6 w-6" />
      </div>
    </div>
  </div>
</template>
