<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUser } from "../../store";
import { OnboardingRoute, LoginRoute } from "../../router";
import { getAbsoluteUrlFromRoute } from "../../utils/getAbsoluteUrlFromRoute";

const router = useRouter();
const loader = useLoader();
const userStore = useUser();

const props = defineProps<{ prefillEmail?: string }>();

const name = ref<string>("");
const email = ref<string>(props.prefillEmail ?? "");
const password = ref<string>("");

async function signup() {
  try {
    if (name.value === "") return alert("Please enter a valid name!");
    if (email.value === "") return alert("Please enter a valid email!");
    if (password.value === "") return alert("Please enter a valid password!");

    loader.show();

    const user = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // Create a new User Entity with API
    await userStore.createUser(name.value);

    await sendEmailVerification(user.user, {
      url: getAbsoluteUrlFromRoute(OnboardingRoute.name),
    });

    router.push({ name: OnboardingRoute.name });
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

      // Pass email so they dont have to retype it
      router.push({
        name: LoginRoute.name,

        // Pass email so they dont have to retype it
        query: { prefillEmail: email.value },
      });
    } else {
      alert("Signup failed!");
    }
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="mx-auto flex h-[90vh] w-full max-w-lg flex-col justify-center">
    <a
      href="https://thepmftool.com"
      target="_blank"
      class="flex w-max flex-row items-center gap-1 pb-6"
    >
      <img src="../../assets/logo.svg" alt="logo" />
      <p class="text-lg tracking-wide">(Sign up)</p>
    </a>

    <div class="pb-6">
      <label>
        <p class="font-light">Name</p>

        <input
          v-model.trim="name"
          type="text"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          placeholder="Jane Doe"
        />
      </label>
    </div>

    <div class="pb-6">
      <label>
        <p class="font-light">Email</p>

        <input
          v-model.trim="email"
          type="text"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          placeholder="janedoe@gmail.com"
        />
      </label>
    </div>

    <div class="pb-10">
      <label>
        <p class="font-light">Password</p>

        <input
          v-model.trim="password"
          type="password"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          placeholder="password"
          @keydown.enter="signup"
        />
      </label>
    </div>

    <button
      class="mb-6 w-full rounded-lg bg-green-600 py-3 text-xl text-white"
      @click="signup"
    >
      Sign up
    </button>

    <router-link
      :to="{ name: LoginRoute.name }"
      class="rounded-lg border border-zinc-200 py-2 text-center font-light text-zinc-900"
    >
      Click here to login
    </router-link>

    <div class="pt-6 text-sm font-thin md:pt-12">
      By signing up, you agree to our
      <a href="https://thepmftool.com/TC.pdf" target="_blank" class="underline"
        >Terms & Conditions</a
      >
      and
      <a href="https://thepmftool.com/PP.pdf" target="_blank" class="underline">
        Privacy Policy
      </a>
    </div>
  </div>
</template>
