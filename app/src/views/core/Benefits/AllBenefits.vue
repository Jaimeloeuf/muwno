<script setup lang="ts">
import { ref } from "vue";
import { useNotif, useLoader, useError } from "../../../store";
import { SurveyResponseRoute } from "../../../router";
import { BenefitController } from "../../../controller";
import { unwrapOrThrow } from "../../../utils";
import TopNavbar from "../../shared/TopNavbar.vue";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const notif = useNotif();
const loader = useLoader();
const errorStore = useError();

const benefitsPerPage = 15;
const benefits = ref(
  unwrapOrThrow(
    await BenefitController.getBenefits(props.productID, benefitsPerPage)
  )
);
const currentHeadIndex = ref<number>(1);

async function previous() {
  // Automatically assume no more 'previous' responses if index is reset to 1.
  if (currentHeadIndex.value === 1) {
    notif.setSnackbar("No more responses!");
    return;
  }

  loader.show();

  const olderBenefits = await BenefitController.getBenefits(
    props.productID,
    -benefitsPerPage,
    benefits.value[0]?.id
  );

  loader.hide();

  if (olderBenefits instanceof Error) {
    errorStore.newError(olderBenefits);
    return;
  }

  if (olderBenefits.length === 0) {
    notif.setSnackbar("No more responses!");
    return;
  }

  benefits.value = olderBenefits;
  currentHeadIndex.value = currentHeadIndex.value - olderBenefits.length;
}

async function next() {
  // Automatically assume no more 'next' responses if number of current
  // responses is less than the standard requested page size.
  if (benefits.value.length < benefitsPerPage) {
    notif.setSnackbar("No more responses!");
    return;
  }

  loader.show();

  const newBenefits = await BenefitController.getBenefits(
    props.productID,
    benefitsPerPage,
    benefits.value.at(-1)?.id
  );

  loader.hide();

  if (newBenefits instanceof Error) {
    errorStore.newError(newBenefits);
    return;
  }

  if (newBenefits.length === 0) {
    notif.setSnackbar("No more responses!");
    return;
  }

  currentHeadIndex.value = currentHeadIndex.value + benefits.value.length;
  benefits.value = newBenefits;
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>All Benefits</TopNavbar>

    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <div class="flex flex-col gap-3 md:flex-row">
        <p class="flex-grow text-lg font-extralight">
          Sorted by most important and newest first
        </p>

        <button
          class="rounded-lg border border-zinc-200 px-3 font-light text-zinc-700"
          @click="previous"
        >
          &lt; previous
        </button>
        <button
          class="rounded-lg border border-zinc-200 bg-zinc-50 px-6 text-zinc-700"
          @click="next"
        >
          next &gt;
        </button>
      </div>

      <div
        v-for="(benefit, i) in benefits"
        :key="benefit.id"
        class="flex w-full flex-row rounded-lg border border-zinc-200 p-3"
      >
        <p class="flex-grow pb-2 text-lg font-light">
          <span class="pr-2">{{ i + currentHeadIndex }}.</span>
          {{ benefit.a3 }}
        </p>

        <div class="flex flex-col gap-3">
          <router-link
            :to="{
              name: SurveyResponseRoute.name,
              params: {
                productID,
                responseID: benefit.id,
              },
            }"
            class="rounded-lg border border-zinc-200 px-3 text-center font-light text-zinc-900"
          >
            Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
