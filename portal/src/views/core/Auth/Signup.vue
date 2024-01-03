<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  type AuthError,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { useLoader, useUser, useError } from "../../../store";
import { OnboardingRoute, LoginRoute } from "../../../router";
import { getAbsoluteUrlFromRoute } from "../../../utils/getAbsoluteUrlFromRoute";
import AuthComponent from "./Auth.vue";
import EnterButton from "../../shared/EnterButton.vue";

const router = useRouter();
const loader = useLoader();
const userStore = useUser();
const errorStore = useError();

const props = defineProps<{ prefillEmail?: string }>();

const name = ref<string>("");
const email = ref<string>(props.prefillEmail ?? "");
const password = ref<string>("");

async function signup() {
  try {
    if (name.value === "") {
      errorStore.newUserError("Please enter a valid name!");
      return;
    }
    if (email.value === "") {
      errorStore.newUserError("Please enter a valid email!");
      return;
    }
    if (password.value === "") {
      errorStore.newUserError("Please enter a valid password!");
      return;
    }

    loader.show();

    const user = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // Create a new User Entity with API
    const result = await userStore.createUser(name.value);

    if (result instanceof Error) {
      loader.hide();
      errorStore.newError(result);
      return;
    }

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
      errorStore.newUserError("Account already exists, please login instead!");

      // Pass email so they dont have to retype it
      router.push({
        name: LoginRoute.name,

        // Pass email so they dont have to retype it
        query: { prefillEmail: email.value },
      });
    } else {
      errorStore.newError("Signup failed!");
    }
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <AuthComponent>
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
  </AuthComponent>
</template>
