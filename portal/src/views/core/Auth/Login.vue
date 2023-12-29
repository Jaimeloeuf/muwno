<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { useLoader, useUser, useOnboarding, useError } from "../../../store";
import {
  AllProductRoute,
  OnboardingRoute,
  SignupRoute,
  LoginRoute,
} from "../../../router";
import { getAbsoluteUrlFromRoute } from "../../../utils/getAbsoluteUrlFromRoute";
import AuthComponent from "./Auth.vue";
import EnterButton from "../../shared/EnterButton.vue";

const router = useRouter();
const loader = useLoader();
const userStore = useUser();
const onboardingStore = useOnboarding();
const errorStore = useError();

const props = defineProps<{ prefillEmail?: string }>();

const email = ref<string>(props.prefillEmail ?? "");
const password = ref<string>("");

async function login() {
  try {
    if (email.value === "") {
      errorStore.newUserError("Please enter a valid email!");
      return;
    }
    if (password.value === "") {
      errorStore.newUserError("Please enter a valid password!");
      return;
    }

    loader.show();

    await signInWithEmailAndPassword(auth, email.value, password.value);

    // Load the user from API, this will also handle any invalid states.
    await userStore.getUser();

    const isOnboarding = await onboardingStore.isOnboarding();

    if (isOnboarding) router.push({ name: OnboardingRoute.name });
    else router.push({ name: AllProductRoute.name });
  } catch (e: unknown) {
    // If Login succeeded but initialisation failed, user should be logged out
    // instead of allowing them to access the UI on refreshing the app since the
    // router guard will think that user is authenticated with the cached JWT.
    if (auth.currentUser !== null) await auth.signOut();

    const error = e as AuthError;
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    if (errorCode === "auth/user-not-found") {
      errorStore.newUserError("Account does not exists, please signup first!");

      router.push({
        name: SignupRoute.name,

        // Pass email so they dont have to retype it
        query: { prefillEmail: email.value },
      });
    } else {
      errorStore.newError("Login failed!");
    }
  } finally {
    loader.hide();
  }
}

async function forgetPassword() {
  if (email.value === "") {
    errorStore.newUserError("Please enter a valid email!");
    return;
  }

  loader.show();

  try {
    await sendPasswordResetEmail(auth, email.value, {
      url: getAbsoluteUrlFromRoute({ name: LoginRoute.name }),
    });

    alert(`Password reset email sent to ${email.value}`);
  } catch (error) {
    const errorCode = (error as { code?: string })?.code;
    console.error(`sendPasswordResetEmail Error Code: ${errorCode}`);
    console.error(error);
    alert(errorCode);
  }

  loader.hide();
}
</script>

<template>
  <AuthComponent>
    <p class="pb-8 text-2xl font-semibold">Sign in</p>

    <div class="pb-6">
      <label>
        <p class="pb-0.5 text-sm font-medium">Email</p>

        <input
          v-model.trim="email"
          type="text"
          class="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 focus:outline-none"
          placeholder="janedoe@business.com"
        />
      </label>
    </div>

    <div class="pb-6">
      <label>
        <p class="pb-0.5 text-sm font-medium">Password</p>

        <input
          v-model.trim="password"
          type="password"
          class="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 focus:outline-none"
          placeholder="secure_password"
          @keydown.enter="login"
        />
      </label>

      <p
        class="cursor-pointer pt-1 text-right text-sm font-extralight underline decoration-zinc-400"
        @click="forgetPassword"
      >
        I forgot my password
      </p>
    </div>

    <EnterButton
      class="mb-8 w-full rounded-md bg-zinc-800 py-1.5 font-medium text-zinc-50"
      @click="login"
    >
      Sign in
    </EnterButton>

    <router-link
      :to="{ name: SignupRoute.name }"
      class="text-zinc-900 underline decoration-zinc-300 underline-offset-2"
    >
      Click here to <span class="font-bold">sign up</span>.
    </router-link>
  </AuthComponent>
</template>
