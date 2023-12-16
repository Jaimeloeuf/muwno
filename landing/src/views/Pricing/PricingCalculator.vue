<script setup lang="ts">
import { ref, computed } from "vue";
import {
  numberFormatter,
  normalMoneyFormatter,
  smallMoneyFormatter,
} from "./utils";
import { flags } from "../../utils/flags";
import { PlanDetails } from "@domain-model";

const emit = defineEmits(["reset"]);

const responses = ref<number>(PlanDetails.included.response);
const responsesPrice = computed(
  () =>
    // Exclude the free included quota
    (responses.value - PlanDetails.included.response) *
    PlanDetails.overage.response.price.USD,
);
const responsesMax = 30_000;
const responsesIsMax = computed(
  () => responses.value.toString() === responsesMax.toString(),
);

const emailsSent = ref<number>(PlanDetails.included.email);
const emailsSentPrice = computed(
  () =>
    // Exclude the free included quota
    (emailsSent.value - PlanDetails.included.email) *
    PlanDetails.overage.email.price.USD,
);
const emailsSentMax = 30_000;
const emailsSentIsMax = computed(
  () => emailsSent.value.toString() === emailsSentMax.toString(),
);

const responsesStored = ref<number>(PlanDetails.included.responseStored);
const responsesStoredPrice = computed(
  () =>
    // Exclude the free included quota
    (responsesStored.value - PlanDetails.included.responseStored) *
    PlanDetails.overage.responseStored.price.USD,
);
const responsesStoredMax = 30_000;
const responsesStoredIsMax = computed(
  () => responsesStored.value.toString() === responsesStoredMax.toString(),
);

const customers = ref<number>(PlanDetails.included.customerStored);
const customersPrice = computed(
  () =>
    // Exclude the free included quota
    (customers.value - PlanDetails.included.customerStored) *
    PlanDetails.overage.customerStored.price.USD,
);
const customersMax = 30_000;
const customersIsMax = computed(
  () => customers.value.toString() === customersMax.toString(),
);

const totalPrice = computed(
  () =>
    responsesPrice.value +
    emailsSentPrice.value +
    responsesStoredPrice.value +
    customersPrice.value,
);
const anySliderMaxed = computed(
  () =>
    responsesIsMax.value ||
    emailsSentIsMax.value ||
    responsesStoredIsMax.value ||
    customersIsMax.value,
);
</script>

<template>
  <div class="w-full rounded-lg border border-zinc-200 p-6">
    <div class="flex flex-row items-center justify-between pb-6">
      <p class="text-2xl font-normal">Calculator</p>

      <button
        class="rounded-lg border border-zinc-400 bg-zinc-100 px-4 py-0.5 shadow"
        @click="$emit('reset')"
      >
        reset
      </button>
    </div>

    <div class="pb-6">
      <p class="text-lg">Survey responses expected</p>
      <p class="text-sm">
        {{ smallMoneyFormatter(PlanDetails.overage.response.price.USD) }}
        / response
      </p>
      <input
        type="range"
        v-model="responses"
        :min="PlanDetails.included.response"
        :max="responsesMax"
        step="10"
        class="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
      <div class="text-right">
        <p>
          <span class="font-normal">{{ numberFormatter(responses) }}</span>
          <template v-if="responsesIsMax"> +</template>
          / month
        </p>
        <p>
          <span
            v-if="responses <= PlanDetails.included.response"
            class="font-medium"
          >
            FREE
          </span>
          <template v-else>
            <span class="font-extralight">
              {{ smallMoneyFormatter(PlanDetails.overage.response.price.USD) }}
              x
              {{ numberFormatter(responses - PlanDetails.included.response) }}
              =
            </span>
            <span class="font-normal">
              {{ normalMoneyFormatter(responsesPrice) }}
            </span>
            <template v-if="responsesIsMax"> +</template>
            / month
          </template>
        </p>
      </div>
    </div>

    <div class="pb-6">
      <p class="text-lg">Survey emails sent</p>
      <p class="text-sm">
        {{ smallMoneyFormatter(PlanDetails.overage.email.price.USD) }}
        / email
      </p>
      <input
        type="range"
        v-model="emailsSent"
        :min="PlanDetails.included.email"
        :max="emailsSentMax"
        step="10"
        class="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
      <div class="text-right">
        <p>
          <span class="font-normal">{{ numberFormatter(emailsSent) }}</span>
          <template v-if="emailsSentIsMax"> +</template>
          / month
        </p>
        <p>
          <span
            v-if="emailsSent <= PlanDetails.included.email"
            class="font-medium"
          >
            FREE
          </span>
          <template v-else>
            <span class="font-extralight">
              {{ smallMoneyFormatter(PlanDetails.overage.email.price.USD) }}
              x
              {{ numberFormatter(emailsSent - PlanDetails.included.email) }}
              =
            </span>
            <span class="font-normal">
              {{ normalMoneyFormatter(emailsSentPrice) }}
            </span>
            <template v-if="emailsSentIsMax"> +</template>
            / month
          </template>
        </p>
      </div>
    </div>

    <div class="pb-6">
      <p class="text-lg">Survey responses stored</p>
      <p class="text-sm">
        {{ smallMoneyFormatter(PlanDetails.overage.responseStored.price.USD) }}
        / response
      </p>
      <input
        type="range"
        v-model="responsesStored"
        :min="PlanDetails.included.responseStored"
        :max="responsesStoredMax"
        step="50"
        class="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
      <div class="text-right">
        <p>
          <span class="font-normal">
            {{ numberFormatter(responsesStored) }}
          </span>
          <template v-if="responsesStoredIsMax"> +</template>
          / month
        </p>
        <p>
          <span
            v-if="responsesStored <= PlanDetails.included.responseStored"
            class="font-medium"
          >
            FREE
          </span>
          <template v-else>
            <span class="font-extralight">
              {{
                smallMoneyFormatter(
                  PlanDetails.overage.responseStored.price.USD,
                )
              }}
              x
              {{
                numberFormatter(
                  responsesStored - PlanDetails.included.responseStored,
                )
              }}
              =
            </span>
            <span class="font-normal">
              {{ normalMoneyFormatter(responsesStoredPrice) }}
              <template v-if="responsesStoredIsMax"> +</template>
            </span>
            / month
          </template>
        </p>
      </div>
    </div>

    <div v-if="flags.devMode" class="pb-6">
      <p class="text-lg">Customers Stored</p>
      <p class="text-sm">
        {{ smallMoneyFormatter(PlanDetails.overage.customerStored.price.USD) }}
        / customer
      </p>
      <input
        type="range"
        v-model="customers"
        :min="PlanDetails.included.customerStored"
        :max="customersMax"
        step="100"
        class="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
      <div class="text-right">
        <p>
          <span class="font-normal">{{ numberFormatter(customers) }}</span>
          <template v-if="customersIsMax"> +</template>
          / month
        </p>
        <p>
          <span
            v-if="customers <= PlanDetails.included.customerStored"
            class="font-medium"
          >
            FREE
          </span>
          <template v-else>
            <span class="font-extralight">
              {{
                smallMoneyFormatter(
                  PlanDetails.overage.customerStored.price.USD,
                )
              }}
              x
              {{
                numberFormatter(customers - PlanDetails.included.customerStored)
              }}
              =
            </span>
            <span class="font-normal">
              {{ normalMoneyFormatter(customersPrice) }}
            </span>
            <template v-if="customersIsMax"> +</template>
            / month
          </template>
        </p>
      </div>
    </div>

    <div class="pt-6 text-right">
      <p class="pb-2 text-xl">
        <span
          v-if="totalPrice === 0"
          class="rounded-lg bg-yellow-300 px-4 font-medium"
        >
          FREE
        </span>
        <template v-else>
          <span class="font-normal">
            {{ normalMoneyFormatter(totalPrice) }}
          </span>
          <template v-if="anySliderMaxed"> +</template>
          <span class="font-extralight"> / month</span>
        </template>
      </p>

      <p class="font-extralight">
        Volume and startup discounts available, email
        <a href="mailto:help@muwno.com" class="italic underline">
          help@muwno.com
        </a>
        for details.
      </p>
    </div>
  </div>
</template>
