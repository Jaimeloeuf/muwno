<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useOrg } from "../../store";
import { ImportCustomerRoute } from "../../router";
import SideDrawer from "../components/SideDrawer.vue";
import type { Product } from "../../types";

const router = useRouter();
const orgStore = useOrg();

const name = ref("");
const daysPerSprint = ref(14);
const sampling = reactive<Product["samplingDetails"]>({
  rate: 1,
  size: 0,
  maxSampleCount: 1,
  coolOff: 4,
});

async function addProduct() {
  // @todo Check inputs

  // @todo Call store method
  const { id } = await orgStore.createNewProduct({
    name: name.value,

    // @todo This should be calculated and done at next page rather than here...
    samplingDetails: sampling,
  });

  router.push({ name: ImportCustomerRoute.name, params: { productID: id } });
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

      <!-- @todo There should be a button for user to choose automatic or use deault -->
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

        <!-- Calculated sample period value -->
        <div class="mt-4">
          <p class="text-lg">Sampling Period</p>
          <div class="w-full rounded-lg bg-slate-100 p-3 font-extralight">
            <p>
              Sampling Rate:
              <span class="font-normal">{{ sampling.rate }}</span>
            </p>
            <p class="ml-10">x</p>
            <p>
              Days per Sprint:
              <span class="font-normal">{{ daysPerSprint }}</span> days
            </p>

            <p class="mt-2 border-t border-slate-300 pt-1 font-normal">
              Every
              {{ sampling.rate * daysPerSprint }} days
            </p>
          </div>
        </div>
      </div>

      <!-- Max Sample Count per user input -->
      <div class="mb-10">
        <label>
          <p class="text-xl">Max Sample Count</p>
          <ul class="list-decimal px-5">
            <li>
              What is the maximum number of times this tool can sample a single
              customer?
            </li>
            <li>
              A customer is considered sampled once they receive a survey link,
              even if they do not open or complete the survey.
            </li>
          </ul>

          <input
            v-model="sampling.maxSampleCount"
            type="number"
            min="1"
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Max Sample Count per customer"
          />
        </label>
      </div>

      <!-- Max Sample Count per user input -->
      <div class="mb-10">
        <label>
          <p class="text-xl">Cool off between samples</p>
          <ul class="list-decimal px-5">
            <li>
              After every sample there should be a cool off time period (in
              number of sprints) before the same user is sampled again, to
              prevent sampling the same user over and over again.
            </li>
            <li>
              How long (in sprints) should we wait before we sample the same
              customer again.
            </li>
          </ul>

          <input
            v-model="sampling.coolOff"
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
