<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUserStore } from "../../store";
import { AllProductRoute, OnboardingRoute, SignupRoute } from "../../router";

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
    else router.push({ name: AllProductRoute.name });
  } catch (error: any) {
    // If Login succeeded but initialisation failed, user should be logged out
    // instead of allowing them to access the UI on refreshing the app since the
    // router guard will think that user is authenticated with the cached JWT.
    if (auth.currentUser !== null) await auth.signOut();

    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    if (errorCode === "auth/user-not-found") {
      alert("Account does not exists, please signup instead!");
      router.push({ name: SignupRoute.name });
    } else {
      alert("Login failed!");
    }
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="mx-auto flex h-[80vh] w-full max-w-lg flex-col justify-center">
    <a href="https://thepmftool.com" target="_blank" class="pb-6">
      <img src="../../assets/logo.svg" alt="logo" />
    </a>

    <div class="pb-6">
      <label>
        <p class="pb-0.5 text-lg font-light">Email</p>

        <input
          v-model="email"
          type="text"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          placeholder="janedoe@gmail.com"
        />
      </label>
    </div>

    <div class="pb-10">
      <label>
        <p class="pb-0.5 text-lg font-light">Password</p>

        <input
          v-model="password"
          type="password"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          placeholder="password"
          @keydown.enter="login"
        />
      </label>
    </div>

    <div class="flex flex-row items-center gap-6">
      <router-link
        :to="{ name: SignupRoute.name }"
        class="rounded-lg bg-zinc-100 p-3 text-xl font-light text-zinc-700"
      >
        Signup
      </router-link>

      <button
        class="w-full rounded-lg bg-green-600 p-3 text-xl text-white"
        @click="login"
      >
        Login
      </button>
    </div>
  </div>
</template>
