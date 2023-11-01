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
import { getAbsoluteUrlFromRoute } from "../../utils/getAbsoluteUrlFromRoute";
import TopNavbar from "../../views/components/TopNavbar.vue";

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

const joinOrg = () =>
  alert("Please ask your team's Owner or Admin to invite you as a member!");

const reloadPage = () => window.location.reload();

if (auth.currentUser === null) {
  throw new Error("Firebase Auth unable to load current user");
}

const faUser = auth.currentUser;

async function sendVerificationEmail() {
  loader.show();
  await sendEmailVerification(faUser, {
    url: getAbsoluteUrlFromRoute(OnboardingRoute.name),
  });
  loader.hide();
  notif.setSnackbar("Email sent!");
}
</script>

<template>
  <div>
    <TopNavbar><span class="text-3xl">Onboarding</span></TopNavbar>

    <div class="mx-auto max-w-xl">
      <div v-if="!faUser.emailVerified" class="pb-12">
        <div class="pb-12">
          <p class="pb-2 text-3xl">Verify Email</p>
          <p class="pb-6 font-light">
            Verify
            <span class="font-light italic underline underline-offset-4">{{
              faUser.email
            }}</span>
            by clicking the link we sent you.
          </p>

          <button
            class="w-full rounded-lg border border-zinc-200 p-2 font-light text-zinc-900"
            @click="reloadPage"
          >
            <p class="text-lg">I verified my email</p>
          </button>
        </div>

        <div class="pb-6">
          <p class="pb-2 text-xl">Why?</p>
          <p class="font-light">
            This will help us verify your identity to prevent bad actors from
            using our platform to scam or spam your customers, making it safer
            for you and your customers!
          </p>
        </div>

        <button
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left"
          @click="sendVerificationEmail"
        >
          <p class="mb-2 text-2xl">Re-send verification email</p>
          <p class="pb-1 font-light">
            Click to resend if you did not receive the verification email.
            Please check your spam folder too!
          </p>
        </button>
      </div>

      <div v-else class="pb-12">
        <router-link
          v-if="teamInvitationStore.invitations.length > 0"
          :to="{ name: PendingInvitationRoute.name }"
        >
          <div class="mb-8 w-full rounded-lg bg-green-600 p-4 text-white">
            <p class="mb-2 text-2xl">Pending Invitations</p>
            <p class="font-light">
              See your pending team invitations. You have
              <b>{{ teamInvitationStore.invitations.length }}</b> pending
              invitation right now.
            </p>
          </div>
        </router-link>

        <button
          v-else
          class="mb-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left"
          @click="joinOrg"
        >
          <p class="mb-2 text-2xl">Join Organisation</p>
          <p class="font-light">
            Join an existing Organisation by getting your Organisation Admin or
            Owner to send you a team invitation in <i>Team > Invite Member</i>.
          </p>
        </button>

        <router-link
          v-if="orgWaitingForSubscription"
          :to="{ name: BuySubscriptionPlanRoute.name }"
        >
          <div
            class="mb-8 w-full rounded-lg border border-green-700 p-4 text-green-700"
          >
            <p class="mb-2 text-2xl">Activate {{ orgName }}</p>
            <p class="font-light">
              Subscribe to activate your Organisation account.
            </p>
          </div>
        </router-link>

        <router-link v-else :to="{ name: CreateOrgRoute.name }">
          <div
            class="mb-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4"
          >
            <p class="mb-2 text-2xl">Create Organisation</p>
            <p class="font-light">Create a new Organisation Account.</p>
          </div>
        </router-link>
      </div>

      <div>
        <p class="mb-2 text-xl font-normal">Need Help?</p>
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
    </div>
  </div>
</template>
