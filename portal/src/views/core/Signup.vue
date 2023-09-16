<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUserStore } from "../../store";
import { OnboardingRoute, LoginRoute } from "../../router";

const router = useRouter();
const loader = useLoader();
const userStore = useUserStore();

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
  <div class="mx-auto flex h-[80vh] w-full max-w-lg flex-col justify-center">
    <a
      href="https://thepmftool.com"
      target="_blank"
      class="flex flex-row items-center gap-1 pb-6"
    >
      <img src="../../assets/logo.svg" alt="logo" />
      <p class="text-lg tracking-tight">(Sign up)</p>
    </a>

    <div class="pb-6">
      <label>
        <p class="font-light">Name</p>

        <input
          v-model="name"
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
          v-model="email"
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
          v-model="password"
          type="password"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          placeholder="password"
        />
      </label>
    </div>

    <div class="flex flex-row items-center gap-6">
      <router-link
        :to="{ name: LoginRoute.name }"
        class="rounded-lg bg-zinc-100 p-3 text-xl font-light text-zinc-700"
      >
        Login
      </router-link>

      <button
        class="w-full rounded-lg bg-green-600 p-3 text-xl text-white"
        @click="signup"
      >
        Signup
      </button>
    </div>
  </div>

  <div class="fixed inset-x-0 bottom-12 mx-auto text-center text-sm font-thin">
    By signing up, you agree to our
    <a href="https://thepmftool.com/TC.pdf" target="_blank" class="underline"
      >Terms & Conditions</a
    >
    and
    <a href="https://thepmftool.com/PP.pdf" target="_blank" class="underline">
      Privacy Policy
    </a>
  </div>
</template>
