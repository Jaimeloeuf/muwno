<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoader } from "../../store";
import { OrgRoute } from "../../router";

const router = useRouter();
const loaderStore = useLoader();

const name = ref("");

async function createOrg() {
  // Check inputs
  if (name.value === "")
    return alert("Please enter a valid Organisation name!");

  loaderStore.show();

  // @todo Call store method

  loaderStore.hide();

  router.push({ name: OrgRoute.name });
}
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <span class="ml-4 text-4xl">Create Organisation</span>
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
      <div class="mb-14">
        <label>
          <p class="text-3xl">Organisation Owner / Admin</p>
          <p>Main account of Organisation</p>

          <div
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6 font-extralight text-slate-800"
          >
            {{ "account@example.com" }}
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
