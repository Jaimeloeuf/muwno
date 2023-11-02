<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useProduct } from "../../store";
import { EditTaskRoute } from "../../router";
import TopNavbar from "../components/TopNavbar.vue";
import { getDateTimeString } from "../../utils/date-formatting/getDateTimeString";
import type {
  ProductID,
  FeedbackResponseID,
  TaskID,
  FeedbackResponse,
  ReadManyTaskDTO,
} from "@domain-model";

const props = defineProps<{
  productID: ProductID;
  responseID: FeedbackResponseID;
  taskID?: TaskID;
}>();

const productStore = useProduct();

const product = await productStore.getProduct(props.productID);

async function getResponse(responseID: FeedbackResponseID) {
  const { res, err } = await sf
    .useDefault()
    .GET(`/feedback/response/${responseID}`)
    .useHeader(getAuthHeader)
    .runJSON<{ response: FeedbackResponse }>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to get Survey Response: ${JSON.stringify(res)}`);

  return res.data.response;
}

async function getTask(responseID: FeedbackResponseID) {
  const { res, err } = await sf
    .useDefault()
    .GET(`/task/of-response/${responseID}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyTaskDTO>();

  if (err) throw err;
  if (!res.ok) throw new Error(`Failed to get Tasks: ${JSON.stringify(res)}`);

  return res.data.tasks;
}

const response = await getResponse(props.responseID);
const tasks = await getTask(props.responseID);

// @todo Might use this to show different UI based on what task user clicked in from
// const mainTask = tasks.filter((task) => task.id === props.taskID);
// const otherTasks = tasks.filter((task) => task.id !== props.taskID);

/** Mapping to convert q1 answers stored as 1, 2, 3 in DB into text */
const a1WordMapping = { 3: "Very", 2: "Somewhat", 1: "Not" };
</script>

<template>
  <div>
    <TopNavbar back>Survey Response</TopNavbar>

    <div class="flex flex-col justify-between gap-8 lg:mx-12 lg:flex-row">
      <div class="lg:basis-1/2">
        <p class="pb-3 text-2xl">Feedback</p>

        <div class="mb-6">
          <p class="mb-2">
            <span class="mr-1">Q1.</span> How would you feel if
            <span class="font-semibold">{{ product.name }}</span>
            no longer exists?
          </p>

          <p class="w-full rounded-lg border border-zinc-200 p-3 font-light">
            {{ a1WordMapping[response.a1] }} disappointed
          </p>
        </div>

        <div class="mb-6">
          <p class="mb-2">
            <span class="mr-1">Q2.</span> What type of people do you think would
            most benefit from
            <span class="font-semibold">{{ product.name }}</span
            >?
          </p>

          <div
            class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light"
            :class="{ 'h-12 bg-zinc-50': response.a2 === '' }"
          >
            {{ response.a2 }}
          </div>
        </div>

        <div class="mb-6">
          <p class="mb-2">
            <span class="mr-1">Q3.</span> What is the main benefit you receive
            from <span class="font-semibold">{{ product.name }}</span
            >?
          </p>

          <div
            class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light"
            :class="{ 'h-12 bg-zinc-50': response.a3 === '' }"
          >
            {{ response.a3 }}
          </div>
        </div>

        <div class="mb-6">
          <p class="mb-2">
            <span class="mr-1">Q4.</span> How can we improve
            <span class="font-semibold">{{ product.name }}</span>
            for you?
          </p>

          <div
            class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light"
            :class="{ 'h-12 bg-zinc-50': response.a4 === '' }"
          >
            {{ response.a4 }}
          </div>
        </div>
      </div>

      <div class="lg:basis-1/2">
        <div class="pb-6">
          <p class="pb-2 text-2xl">Generated Tasks</p>
          <div
            v-for="(task, i) in tasks"
            :key="task.id"
            class="relative mb-4 rounded-lg border border-zinc-200 p-3 text-lg"
          >
            <router-link
              :to="{ name: EditTaskRoute.name, params: { taskID: task.id } }"
              class="absolute right-0 top-0 rounded-bl-lg bg-zinc-200 px-2 font-light text-zinc-800"
            >
              edit
            </router-link>

            <p class="pr-10 font-light">{{ i + 1 }}. {{ task.task }}</p>
            <p v-if="task.id === taskID" class="pt-1 text-sm">
              Page opened by clicking this task's
              <span
                class="rounded-lg border border-zinc-200 px-1 text-center font-light text-zinc-900"
                >Details</span
              >
              button
            </p>
          </div>
        </div>

        <div>
          <p class="text-2xl">Metadata</p>

          <div class="rounded-lg border border-zinc-200 p-3">
            <p class="text-lg">Time of feedback</p>
            <p class="w-max rounded-md bg-zinc-100 px-2 py-1 text-zinc-900">
              {{ getDateTimeString(response.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
