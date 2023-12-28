<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useLoader, useUser, useOnboarding } from "../../store";
import {
  AllProductRoute,
  OnboardingRoute,
  SignupRoute,
  LoginRoute,
} from "../../router";
import { getAbsoluteUrlFromRoute } from "../../utils/getAbsoluteUrlFromRoute";
import { landingLink } from "../../utils/links";
import EnterButton from "../shared/EnterButton.vue";

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

async function forgetPassword() {
  if (email.value === "") return alert("Please enter a valid email!");

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
            :to="{}"
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
