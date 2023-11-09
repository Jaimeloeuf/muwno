<script setup lang="ts">
import { ref, computed } from "vue";
import {
  numberFormatter,
  normalMoneyFormatter,
  smallMoneyFormatter,
} from "./utils";
import { PlanDetails } from "@domain-model";

const responses = ref<number>(PlanDetails.included.response);
const responsesPrice = computed(
  () =>
    // Remove the quota included the base subscription
    (responses.value - PlanDetails.included.response) *
    PlanDetails.overage.response.price.SGD,
);

const emailsSent = ref<number>(PlanDetails.included.email);
const emailsSentPrice = computed(
  () =>
    // Remove the quota included the base subscription
    (emailsSent.value - PlanDetails.included.email) *
    PlanDetails.overage.email.price.SGD,
);

const responsesStored = ref<number>(PlanDetails.included.responseStored);
const responsesStoredPrice = computed(
  () =>
    // Remove the quota included the base subscription
    (responsesStored.value - PlanDetails.included.responseStored) *
    PlanDetails.overage.responseStored.price.SGD,
);

const baseSubscriptionPrice = PlanDetails.price.SGD.yearly / 12;
const overagePrice = computed(
  () =>
    responsesPrice.value + emailsSentPrice.value + responsesStoredPrice.value,
);
const totalPrice = computed(() => baseSubscriptionPrice + overagePrice.value);
</script>

<template>
  <div class="w-full rounded-lg border border-zinc-200 p-6">
    <div class="pb-6">
      <p class="font-medium">Pricing Estimate (by month)</p>
    </div>

    <div class="pb-6">
      <label for="default-range" class="mb-2">
        <p>Survey Responses: {{ numberFormatter(responses) }}</p>
        <p>
          Overage Price:
          <template v-if="responses <= PlanDetails.included.response">
            $0, included with base subscription
          </template>
          <template v-else>
            {{ normalMoneyFormatter(responsesPrice) }}
            ({{ smallMoneyFormatter(PlanDetails.overage.response.price.SGD) }} x
            {{ numberFormatter(responses - PlanDetails.included.response) }})
          </template>
        </p>
      </label>
      <input
        type="range"
        v-model="responses"
        :min="PlanDetails.included.response"
        max="100000"
        step="100"
        class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
    </div>

    <div class="pb-6">
      <label for="default-range" class="mb-2">
        <p>Emails sent: {{ numberFormatter(emailsSent) }}</p>
        <p>
          Overage Price:
          <template v-if="emailsSent <= PlanDetails.included.response">
            $0, included with base subscription
          </template>
          <template v-else>
            {{ normalMoneyFormatter(emailsSentPrice) }}
            ({{ smallMoneyFormatter(PlanDetails.overage.email.price.SGD) }} x
            {{ numberFormatter(emailsSent - PlanDetails.included.email) }})
          </template>
        </p>
      </label>
      <input
        type="range"
        v-model="emailsSent"
        :min="PlanDetails.included.email"
        max="1000000"
        step="1000"
        class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
    </div>

    <div class="pb-6">
      <label for="default-range" class="mb-2">
        <p>Responses Stored: {{ numberFormatter(responsesStored) }}</p>
        <p>
          Overage Price:
          <template
            v-if="responsesStored <= PlanDetails.included.responseStored"
          >
            $0, included with base subscription
          </template>
          <template v-else>
            {{ normalMoneyFormatter(responsesStoredPrice) }}
            ({{
              smallMoneyFormatter(PlanDetails.overage.responseStored.price.SGD)
            }}
            x
            {{
              numberFormatter(
                responsesStored - PlanDetails.included.responseStored,
              )
            }})
          </template>
        </p>
      </label>
      <input
        type="range"
        v-model="responsesStored"
        :min="PlanDetails.included.responseStored"
        max="1000000"
        step="1000"
        class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
      />
    </div>

    <div class="pt-4">
      Price

      <div class="flex flex-row justify-between">
        <p>Base Subscription (paid yearly)</p>
        <p>{{ normalMoneyFormatter(baseSubscriptionPrice) }} / month</p>
      </div>
      <div class="flex flex-row justify-between">
        <p>Overage</p>
        <p>{{ normalMoneyFormatter(overagePrice) }} / month</p>
      </div>
      <div class="flex flex-row justify-between pt-4 font-medium">
        <p>Total</p>
        <p>{{ normalMoneyFormatter(totalPrice) }} / month</p>
      </div>
      <p class="text-right font-extralight">
        Volume discount is available, email
        <a href="mailto:help@muwno.com" class="italic underline">
          help@muwno.com
        </a>
        for details.
      </p>
    </div>
  </div>
</template>
