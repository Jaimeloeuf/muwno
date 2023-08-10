<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUserStore } from "../../store";
import { OrgRoute, OnboardingRoute, SignupRoute } from "../../router";

const router = useRouter();
const loader = useLoader();
const userStore = useUserStore();

const email = ref<string>("");
const password = ref<string>("");

async function login() {
  try {
    if (email.value === "") return alert("Please enter a valid email!");
    if (password.value === "") return alert("Please enter a valid password!");

    loader.show();

    await signInWithEmailAndPassword(auth, email.value, password.value);

    const user = await userStore.initOnLogin();

    // If user does not have an Org, means they did not complete onboarding flow,
    // route them to continue with onboarding, else route them to Org home page.
    if (user.orgID === undefined) router.push({ name: OnboardingRoute.name });
    else router.push({ name: OrgRoute.name });
  } catch (error: any) {
    // If Login succeeded but initialisation failed, user should be logged out
    // instead of allowing them to access the UI on refreshing the app since the
    // router guard will think that user is authenticated with the cached JWT.
    if (auth.currentUser !== null) await auth.signOut();

    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    alert("Login failed!");
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-lg">
    <div class="my-10">
      <p class="text-4xl">The PMF Tool</p>
    </div>

    <div class="mb-10">
      <label>
        <p class="text-xl">Email</p>

        <input
          v-model="email"
          type="text"
          class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
          placeholder="janedoe@gmail.com"
        />
      </label>
    </div>

    <div class="mb-10">
      <label>
        <p class="text-xl">Password</p>

        <input
          v-model="password"
          type="password"
          class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
          placeholder="password"
        />
      </label>
    </div>

    <button
      class="w-full rounded-lg bg-lime-500 p-3 text-xl tracking-widest text-white"
      @click="login"
    >
      LOGIN
    </button>

    <div class="mt-12 text-center">
      <router-link :to="{ name: SignupRoute.name }" class="underline">
        click here to signup
      </router-link>
    </div>
  </div>
</template>
