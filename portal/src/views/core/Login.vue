<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUser, useOnboarding } from "../../store";
import { AllProductRoute, OnboardingRoute, SignupRoute } from "../../router";

const router = useRouter();
const loader = useLoader();
const userStore = useUser();
const onboardingStore = useOnboarding();

const props = defineProps<{ prefillEmail?: string }>();

const email = ref<string>(props.prefillEmail ?? "");
const password = ref<string>("");

async function login() {
  try {
    if (email.value === "") return alert("Please enter a valid email!");
    if (password.value === "") return alert("Please enter a valid password!");

    loader.show();

    await signInWithEmailAndPassword(auth, email.value, password.value);

    // Load the user from API, this will also handle any invalid states.
    await userStore.getUser();

    const isOnboarding = await onboardingStore.isOnboarding();

    if (isOnboarding) router.push({ name: OnboardingRoute.name });
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

      router.push({
        name: SignupRoute.name,

        // Pass email so they dont have to retype it
        query: { prefillEmail: email.value },
      });
    } else {
      alert("Login failed!");
    }
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="mx-auto flex h-[90vh] w-full max-w-lg flex-col justify-center">
    <a href="https://thepmftool.com" target="_blank" class="w-max pb-6">
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

    <button
      class="mb-6 w-full rounded-lg bg-green-600 py-3 text-xl text-white"
      @click="login"
    >
      Login
    </button>

    <router-link
      :to="{ name: SignupRoute.name }"
      class="rounded-lg border border-zinc-200 py-2 text-center font-light text-zinc-900"
    >
      Click here to sign up
    </router-link>
  </div>
</template>
