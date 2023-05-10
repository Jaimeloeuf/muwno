<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

import loader from "../components/Loader.vue";
import version from "../components/Version.vue";
import { HomeRoute } from "../../router";
import { useUserStore } from "../../store";
import { initStoresOnLoginSuccess } from "../../store";

const router = useRouter();
const userStore = useUserStore();

/**
 * Boolean used to toggle the full screen loader
 */
const loading = ref<boolean>(false);

/**
 * Create provider and set custom param to prompt user to select account.
 * This is so that the default account will not be choosen automatically,
 * in case the user signed up with a different account.
 *
 * References:
 * - https://firebase.google.com/docs/reference/node/firebase.auth.GoogleAuthProvider#setcustomparameters
 * - https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
 */
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

/**
 * Triggers google login and on success, hand over initialisation to user store.
 *
 * @todo use a full screen loader
 * @todo Perhaps do after i implement global loader component?
 * @todo See if i can implement global notification banner component like blockchain-demo app?
 */
async function login() {
  try {
    // Get the signed-in user's info
    // https://firebase.google.com/docs/auth/web/google-signin
    const { user } = await signInWithPopup(auth, provider);

    // Show fullscreen loader once Google Login is completed,
    // and before API call to setup the app.
    loading.value = true;

    // Pass user object to userStore to continue initialisation process.
    // This will throw on any error, to handle it here if initialisation failed.
    await userStore.initOnLogin(user);

    // After initializing user, call function to individually initialize
    // every single other store that needs initialization after login.
    await initStoresOnLoginSuccess();

    router.push({ name: HomeRoute.name });
  } catch (error: any) {
    console.error(error);

    // If Google Login succeeded but userStore initialisation failed,
    // user should be logged out, instead of allowing them to access
    // the UI on refreshing the app since the router guard will think
    // that the user is authenticated with the cached user token.
    if (auth.currentUser !== null) await auth.signOut();

    // Skip alert
    if (error.code === "auth/popup-closed-by-user") return;

    // Update user about failure and the reason why so they can report it if needed.
    alert(error);
  } finally {
    // Remove fullscreen loader regardless of outcome
    loading.value = false;
  }
}
</script>

<template>
  <!-- Full screen loader used when saving stock take -->
  <loader :show="loading">
    <div class="section center">
      <div class="columns is-multiline has-text-left m-4">
        <div class="column is-full">
          <button
            class="button is-fullwidth is-success is-large"
            @click="login"
          >
            login
          </button>
        </div>

        <div class="column is-full">
          <version />
        </div>
      </div>
    </div>
  </loader>
</template>
