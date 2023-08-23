<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useOrg, useUserStore, useLoader } from "../../store";
import { OrgRoute } from "../../router";

const router = useRouter();
const orgStore = useOrg();
const userStore = useUserStore();
const loaderStore = useLoader();

const name = ref("");
const orgEmail = ref(userStore.user.email); // Defaults to the Org Owner's email

// If user already have an organisation redirect to Org home view.
if (orgStore.orgDetails !== undefined) router.push({ name: OrgRoute.name });

async function createOrg() {
  // Check inputs
  if (name.value === "")
    return alert("Please enter a valid Organisation name!");

  loaderStore.show();

  await orgStore.createOrg({
    name: name.value,
    email: orgEmail.value,
  });

  loaderStore.hide();

  router.push({ name: OrgRoute.name });
}
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <span class="text-4xl">Create Organisation</span>
    </div>

    <div class="mx-auto w-full max-w-md">
      <!-- Organisation Name input -->
      <div class="mb-12">
        <label>
          <p class="text-3xl">Organisation Name</p>
          <p>This is what your customer's will see</p>

          <input
            v-model="name"
            type="text"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Name"
          />
        </label>
      </div>

      <!-- Organisation Owner Account display -->
      <div class="mb-10">
        <label>
          <p class="text-3xl">Organisation Administrative Email</p>
          <ul class="list-decimal px-5">
            <li>
              Main administrative email address used for things like
              subscription payment and invoicing.
            </li>
            <li>Defaults to Organisation Owner's email.</li>
          </ul>

          <input
            v-model="orgEmail"
            type="text"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Organisation Email"
          />
        </label>
      </div>

      <!-- Organisation Owner Account display -->
      <div class="mb-14">
        <label>
          <p class="text-3xl">Organisation Owner</p>
          <p>Main admin account of Organisation</p>

          <div
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6 font-extralight text-slate-800"
          >
            {{ userStore.user.email }}
          </div>
        </label>
      </div>

      <button
        class="w-full rounded-lg bg-green-600 p-4 text-xl text-white shadow"
        @click="createOrg"
      >
        Create
      </button>
    </div>
  </div>
</template>
