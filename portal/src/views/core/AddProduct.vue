<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useOrg } from "../../store";
import {} from "../../router";
import SideDrawer from "../components/SideDrawer.vue";
import type { Product } from "../../types";

const router = useRouter();
const orgStore = useOrg();

const name = ref("");
const daysPerSprint = ref(14);
const sampling = reactive<Product["samplingDetails"]>({
  rate: 1,
  size: 0,
});

async function addProduct() {
  // @todo Check inputs

  // @todo Call store method
  const { id } = await orgStore.createNewProduct({
    name: name.value,
    samplingDetails: sampling,
  });

  router.push({});
}
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">Add new Product</span>
    </div>

    <div class="mx-auto w-full max-w-md">
      <!-- Product Name input -->
      <div class="mb-10">
        <label>
          <p class="text-3xl">Product Name</p>
          <p>This is what your customer's will see</p>

          <input
            v-model="name"
            type="text"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Name"
          />
        </label>
      </div>

      <!-- Number of days per sprint input -->
      <div class="mb-10">
        <label>
          <p class="text-3xl">Number of Days per Sprint</p>
          <ul class="list-decimal px-5">
            <li>How many days is your product / feature release cycle?</li>
            <li>
              Your customers will be surveyed using a multiple of this number of
              days.
            </li>
            <li>Defaults to 14 days for a biweekly sprint cycle.</li>
            <li>Minimum 7 days per sprint.</li>
          </ul>

          <input
            v-model="daysPerSprint"
            type="number"
            min="7"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Number of Days"
          />
        </label>
      </div>

      <!-- Sampling Details section header -->
      <div class="mb-6 border-t pt-4">
        <p class="text-3xl">Sampling Details</p>
      </div>

      <!-- Sampling Rate input -->
      <div class="mb-10">
        <label>
          <p class="text-xl">Rate</p>
          <ul class="list-decimal px-5">
            <li>Rate of sampling / surveying your customers.</li>
            <li>
              This is a multiple of your sprint, i.e. 1 means survey your
              customers after every single sprint and 2 means survey your
              customers once every 2 sprints.
            </li>
            <li>By default this samples once every sprint.</li>
          </ul>

          <input
            v-model="sampling.rate"
            type="number"
            min="1"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Number of Sprints"
          />
        </label>
      </div>

      <button
        class="w-full rounded-lg bg-green-600 p-4 text-xl text-white shadow"
        @click="addProduct"
      >
        Add
      </button>
    </div>
  </div>
</template>
