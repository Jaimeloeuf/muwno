<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { useLoader, useNotif } from "../../../../../store";
import { AllProductRoute } from "../../../../../router";
import { getAuthHeader } from "../../../../../firebase";
import type { Product } from "@domain-model";

const props = defineProps<{ product: Product }>();

const router = useRouter();
const loader = useLoader();
const notif = useNotif();

const showHelp = ref(false);
const newOrgID = ref("");

async function transfer() {
  if (newOrgID.value === "") return alert("Please enter a valid OrgID");
  if (!confirm("Confirm Transfer?")) return;

  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/product/transfer/${props.product.id}/to/${newOrgID.value}`)
    .useHeader(getAuthHeader)
    .runJSON();

  if (err) throw err;
  if (!res.ok) throw new Error(`Fail to transfer: ${JSON.stringify(res)}`);

  loader.hide();

  notif.setSnackbar(`Transferred ${props.product.name}!`);

  router.push({ name: AllProductRoute.name });
}
</script>

<template>
  <div class="rounded-lg border border-red-200 p-4 text-left">
    <div class="mb-2 flex flex-row items-center justify-between gap-6">
      <p class="text-red-600">Transfer Product</p>

      <button
        class="rounded-lg bg-zinc-100 px-3 font-light text-zinc-900"
        @click="showHelp = !showHelp"
      >
        Help
      </button>
    </div>

    <p v-if="showHelp" class="mb-4 border-t border-zinc-200 pt-2 font-light">
      Use this to transfer this product to a new Organisation. If you need help
      with this, reach out to us at
      <a class="underline" href="mailto:help@muwno.com">help@muwno.com</a>
    </p>

    <div class="flex w-full flex-row gap-3 pt-2">
      <input
        v-model.trim="newOrgID"
        type="text"
        class="w-full rounded-lg border border-zinc-200 p-3 focus:outline-none"
        placeholder="New OrgID"
      />

      <button
        class="flex flex-row items-center justify-between rounded-lg border border-red-200 p-2 text-red-600"
        @click="transfer"
      >
        <span class="pr-3">Transfer</span>

        <svg
          class="h-3 w-3 shrink-0 rotate-90 transition duration-150"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5 5 1 1 5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
