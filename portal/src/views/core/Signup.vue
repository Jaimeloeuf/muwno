<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  type AuthError,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUser } from "../../store";
import { OnboardingRoute, LoginRoute } from "../../router";
import { getAbsoluteUrlFromRoute } from "../../utils/getAbsoluteUrlFromRoute";
import { landingLink } from "../../utils/links";
import EnterButton from "../shared/EnterButton.vue";

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
      url: getAbsoluteUrlFromRoute({ name: OnboardingRoute.name }),
    });

    router.push({ name: OnboardingRoute.name });
  } catch (e: unknown) {
    // If Login succeeded but initialisation failed, user should be logged out
    // instead of allowing them to access the UI on refreshing the app since the
    // router guard will think that user is authenticated with the cached JWT.
    if (auth.currentUser !== null) await auth.signOut();

    // @todo Handle the case where account already exists!

    const error = e as AuthError;
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
  <!-- -m-6 is used to cancel out the p-6 class set on App.vue's root component -->
  <div class="-m-6 flex flex-row justify-between">
    <div
      class="hidden h-screen w-full max-w-xs bg-gradient-to-tr from-zinc-950 from-5% to-sky-900 to-95% md:flex md:flex-col md:justify-center md:px-8 lg:max-w-md xl:max-w-lg xl:px-12"
    >
      <div class="text-white">
        <a :href="landingLink" target="_blank">
          <img src="../../assets/logo.svg" alt="logo" class="h-12" />
        </a>

        <p class="pb-8 text-xl font-bold text-zinc-200">Earn More</p>

        <p class="text-xl tracking-wide text-zinc-200 lg:text-2xl">
          Customer Feedback<br />
          collection and analysis<br />
          to grow your business.
        </p>
      </div>
    </div>

    <div
      class="flex h-screen w-full flex-col justify-center bg-white bg-cover bg-center px-8 md:bg-zinc-50 md:bg-[url(../assets/auth_bg.avif)]"
    >
      <div class="mx-auto w-full max-w-sm">
        <a :href="landingLink" target="_blank" class="w-max md:hidden">
          <img src="../../assets/logo.svg" alt="logo" />
        </a>

        <div
          class="rounded-2xl bg-white py-12 md:border md:border-zinc-100 md:px-8 md:shadow-2xl md:shadow-zinc-500"
        >
          <p class="pb-8 text-2xl font-semibold">Sign up</p>

          <div class="pb-6">
            <label>
              <p class="pb-0.5 text-sm font-medium">Name</p>

              <input
                v-model.trim="name"
                type="text"
                class="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 focus:outline-none"
                placeholder="Jane Doe"
              />
            </label>
          </div>

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

          <div class="pb-10">
            <label>
              <p class="pb-0.5 text-sm font-medium">Password</p>

              <input
                v-model.trim="password"
                type="password"
                class="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 focus:outline-none"
                placeholder="secure_password"
                @keydown.enter="signup"
              />
            </label>
          </div>

          <EnterButton
            :to="{}"
            class="mb-8 w-full rounded-md bg-zinc-800 py-1.5 font-medium text-zinc-50"
            @click="signup"
          >
            Sign up
          </EnterButton>

          <router-link
            :to="{ name: LoginRoute.name }"
            class="text-zinc-900 underline decoration-zinc-300 underline-offset-2"
          >
            Click here to <span class="font-bold">sign in</span>.
          </router-link>
        </div>

        <div
          class="absolute bottom-8 px-2 text-[0.6rem] font-thin md:text-white"
        >
          By using our product, you agree to our
          <a :href="`${landingLink}/PP.pdf`" target="_blank" class="underline">
            Privacy Policy
          </a>
          and
          <a :href="`${landingLink}/TC.pdf`" target="_blank" class="underline"
            >Terms & Conditions</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
