<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUserStore, useTeamInvitationStore } from "../../store";
import {
  CreateOrgRoute,
  PendingInvitationRoute,
  LoginRoute,
} from "../../router";

const router = useRouter();
const loader = useLoader();
const userStore = useUserStore();
const teamInvitationStore = useTeamInvitationStore();

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");

async function signup() {
  try {
    if (name.value === "") return alert("Please enter a valid name!");
    if (email.value === "") return alert("Please enter a valid email!");
    if (password.value === "") return alert("Please enter a valid password!");

    loader.show();

    await createUserWithEmailAndPassword(auth, email.value, password.value);

    // Create a new User Entity with API
    await userStore.createUser(name.value);

    const userHavePendingInvitations =
      await teamInvitationStore.checkForPendingTeamInvitations();

    if (userHavePendingInvitations)
      router.push({ name: PendingInvitationRoute.name });
    else router.push({ name: CreateOrgRoute.name });
  } catch (error: any) {
    // If Login succeeded but initialisation failed, user should be logged out
    // instead of allowing them to access the UI on refreshing the app since the
    // router guard will think that user is authenticated with the cached JWT.
    if (auth.currentUser !== null) await auth.signOut();

    // @todo Handle the case where account already exists!

    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    if (errorCode === "auth/email-already-in-use") {
      alert("Account already exists, please login instead!");
      router.push({ name: LoginRoute.name });
    } else {
      alert("Signup failed!");
    }
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-lg">
    <div class="mb-4 mt-10">
      <p class="text-3xl">
        Sign up for
        <span class="font-semibold tracking-tighter">thepmftool</span>
      </p>
    </div>

    <div class="mb-6">
      <label>
        <p class="text-xl">Name</p>

        <input
          v-model="name"
          type="text"
          class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-4"
          placeholder="Jane Doe"
        />
      </label>
    </div>

    <div class="mb-6">
      <label>
        <p class="text-xl">Email</p>

        <input
          v-model="email"
          type="text"
          class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-4"
          placeholder="janedoe@gmail.com"
        />
      </label>
    </div>

    <div class="mb-6">
      <label>
        <p class="text-xl">Password</p>

        <input
          v-model="password"
          type="password"
          class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-4"
          placeholder="password"
        />
      </label>
    </div>

    <button
      class="w-full rounded-lg bg-lime-500 p-3 text-xl tracking-widest text-white"
      @click="signup"
    >
      SIGNUP
    </button>

    <div class="mt-10 text-center">
      <router-link :to="{ name: LoginRoute.name }" class="underline">
        click here to login
      </router-link>
    </div>
  </div>
</template>
