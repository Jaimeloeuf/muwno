<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useOrg, useUser, useLoader } from "../../../store";
import { AllProductRoute, BuySubscriptionPlanRoute } from "../../../router";
import TopNavbar from "../../components/TopNavbar.vue";

const router = useRouter();
const orgStore = useOrg();
const userStore = useUser();
const loader = useLoader();

const user = await userStore.getUser();

const name = ref("");
const email = ref(user.email); // Defaults to the Org Owner's email
const phone = ref("");
const address = ref("");

// If user already have an organisation, ask them if they want to continue, else
// redirect to their original Org's home view.
if (
  (await orgStore.doesUserHaveOrg()) &&
  !confirm("You already have an Organisation, create a new one?")
)
  router.push({ name: AllProductRoute.name });

async function createOrg() {
  // Check inputs
  if (name.value === "")
    return alert("Please enter a valid Organisation name!");
  if (email.value === "")
    return alert("Please enter a valid Organisation email!");

  loader.show();

  await orgStore.createOrg({
    name: name.value,
    email: email.value,
    phone: phone.value !== "" ? phone.value : null,
    address: address.value !== "" ? address.value : null,
  });

  loader.hide();

  router.push({ name: BuySubscriptionPlanRoute.name });
}
</script>

<template>
  <div>
    <TopNavbar back>Create Organisation</TopNavbar>

    <div class="mx-auto w-full max-w-lg">
      <div class="pb-10">
        <label>
          <p class="text-3xl">Name</p>
          <p>This is what your customer's will see</p>

          <input
            v-model.trim="name"
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-200 p-6"
            placeholder="Name"
          />
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-3xl">Administrative Email</p>
          <ul class="list-decimal px-5">
            <li>
              Main administrative email address used for things like
              subscription payment and invoicing.
            </li>
            <li>Defaults to Organisation Owner's email.</li>
          </ul>

          <input
            v-model.trim="email"
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-200 p-6"
            placeholder="Organisation Email"
          />
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-3xl">
            Phone Number <span class="pl-3 text-2xl font-thin">*Optional</span>
          </p>
          <ul class="list-decimal px-5">
            <li>
              Main administrative phone number used for things like subscription
              payment and invoicing.
            </li>
            <li>Please include the country and area code too.</li>
            <li>
              Providing this will also help us speed up your account
              verification process.
            </li>
          </ul>

          <input
            v-model.trim="phone"
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-200 p-6"
            placeholder="Phone Number"
          />
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-3xl">
            Address <span class="pl-3 text-2xl font-thin">*Optional</span>
          </p>
          <ul class="list-decimal px-5">
            <li>
              Organisation address is optional, but required if you would like
              to join our highly effective gamification programmes.
            </li>
            <li>
              Providing this will also help us speed up your account
              verification process.
            </li>
          </ul>

          <textarea
            v-model.trim="address"
            rows="3"
            class="mt-4 w-full resize-none rounded-lg border border-zinc-200 p-6"
          >
          </textarea>
        </label>
      </div>

      <button
        class="w-full rounded-lg border border-green-600 p-4 text-xl text-green-600"
        @click="createOrg"
      >
        Create
      </button>
    </div>
  </div>
</template>
