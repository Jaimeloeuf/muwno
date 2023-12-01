<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useOrg, useUser, useLoader } from "../../../store";
import { AllProductRoute, BuySubscriptionPlanRoute } from "../../../router";
import TopNavbar from "../../shared/TopNavbar.vue";
import { type OrgSize, orgSizes } from "@domain-model";

const router = useRouter();
const orgStore = useOrg();
const userStore = useUser();
const loader = useLoader();

const user = await userStore.getUser();

const name = ref("");
const email = ref(user.email); // Defaults to the Org Owner's email
const phone = ref("");
const address = ref("");
const selectedOrgSize = ref<OrgSize | null>(null);

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
  if (phone.value === "") return alert("Please enter a valid Phone Number!");

  loader.show();

  await orgStore.createOrg({
    name: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value !== "" ? address.value : null,
    size: selectedOrgSize.value,
  });

  loader.hide();

  router.push({ name: BuySubscriptionPlanRoute.name });
}
</script>

<template>
  <div>
    <TopNavbar back>Create Organisation</TopNavbar>

    <div class="flex w-full flex-col gap-10 lg:flex-row lg:px-12">
      <div class="w-full">
        <div class="pb-10">
          <label>
            <p class="text-xl">Name</p>
            <p>This is what your customer's will see</p>

            <input
              v-model.trim="name"
              type="text"
              class="mt-4 w-full rounded-lg border border-zinc-200 p-3 focus:outline-none"
              placeholder="Name"
            />
          </label>
        </div>

        <div class="pb-10">
          <label>
            <p class="text-xl">Administrative Email</p>
            <ul class="list-decimal px-5">
              <li>
                Administrative email address used for subscription payment,
                invoicing and more.
              </li>
              <li>Defaults to Organisation Owner's email.</li>
            </ul>

            <input
              v-model.trim="email"
              type="text"
              class="mt-4 w-full rounded-lg border border-zinc-200 p-3 focus:outline-none"
              placeholder="Organisation Email"
            />
          </label>
        </div>

        <div>
          <label>
            <p class="text-xl">Phone Number</p>
            <ul class="list-decimal px-5">
              <li>
                Administrative phone number used for subscription payment,
                invoicing and more.
              </li>
              <li>Please include country and area code too.</li>
            </ul>

            <input
              v-model.trim="phone"
              type="text"
              class="mt-4 w-full rounded-lg border border-zinc-200 p-3 focus:outline-none"
              placeholder="Phone Number"
            />
          </label>
        </div>
      </div>

      <div class="w-full">
        <div class="pb-10">
          <label>
            <p class="text-xl">
              Organisation Size
              <span class="pl-3 font-thin">*Optional</span>
            </p>
            <ul class="list-decimal px-5">
              <li>
                Help us understand your Organisation to improve your experience.
              </li>
            </ul>

            <select
              v-model="selectedOrgSize"
              class="mt-4 w-full rounded-lg border border-zinc-200 p-4 focus:outline-none"
            >
              <option selected disabled>Choose Estimate</option>
              <option
                v-for="orgSize in orgSizes"
                :key="orgSize"
                :value="orgSize"
                :selected="orgSize === selectedOrgSize"
              >
                {{ orgSize }}
              </option>
            </select>
          </label>
        </div>

        <div class="pb-10">
          <label>
            <p class="text-xl">
              Address <span class="pl-3 font-thin">*Optional</span>
            </p>
            <ul class="list-decimal px-5">
              <li>
                Organisation address is optional but required for you to join
                our highly effective gamification programmes.
              </li>
              <li>
                Providing this will also speed up your account verification.
              </li>
            </ul>

            <textarea
              v-model.trim="address"
              rows="3"
              class="mt-4 w-full resize-none rounded-lg border border-zinc-200 p-3 focus:outline-none"
            >
            </textarea>
          </label>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-lg pt-12">
      <button
        class="w-full rounded-lg border border-green-600 p-4 text-xl text-green-600"
        @click="createOrg"
      >
        Create
      </button>
    </div>
  </div>
</template>
