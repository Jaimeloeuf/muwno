<script setup lang="ts">
import { ref, watch } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";

const emits = defineEmits<{ (e: "couponUsed", coupon: null | string): void }>();

const couponCode = ref<string>("");
const checked = ref<boolean>(false);
const isValid = ref<boolean>(false);

// Reset the checked state everytime the coupon code is changed.
watch(couponCode, () => (checked.value = false));

async function useCouponCode() {
  // Prevent searching for empty string since the API URL will be a 404
  if (couponCode.value === "") return;

  const { res, err } = await sf
    .useDefault()
    .GET(`/stripe/subscription/coupon/check-validity/${couponCode.value}`)
    .useHeader(getAuthHeader)
    .runJSON<{ valid: boolean }>();

  if (err) throw new Error(`Unable to check coupon validity: ${err}`);
  if (!res.ok)
    throw new Error(`Unable to check coupon validity: ${JSON.stringify(res)}`);

  isValid.value = res.data.valid;
  checked.value = true;

  // Emit coupon code if valid, else emit null to reset coupon code in parent.
  emits("couponUsed", isValid.value ? couponCode.value : null);
}

function clearCoupon() {
  couponCode.value = "";
  checked.value = false;
}
</script>

<template>
  <div>
    <p class="pb-1 text-xl">Have a coupon?</p>

    <div class="flex flex-row gap-3">
      <input
        v-model.trim="couponCode"
        type="text"
        class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
        :class="{ 'border-red-500': checked && !isValid }"
        placeholder="Coupon Code"
        @keydown.enter="useCouponCode"
      />

      <button
        class="rounded-lg border border-zinc-200 bg-zinc-50 px-6 text-zinc-900"
        @click="useCouponCode"
      >
        use
      </button>
    </div>

    <div v-if="checked" class="mt-2">
      <p v-if="isValid" class="text-green-700">Coupon Applied!</p>

      <div v-else>
        <span class="text-red-700">Coupon is invalid!</span>
        <button class="ml-4 underline" @click="clearCoupon">
          clear coupon
        </button>
      </div>
    </div>
  </div>
</template>
