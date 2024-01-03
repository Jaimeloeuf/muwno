<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useProduct, useLoader, useNotif, useError } from "../../store";
import { EditTaskRoute } from "../../router";
import { TaskController } from "../../controller";
import TopNavbar from "../shared/TopNavbar.vue";
import { prettyJSON, getDateTimeString } from "../../utils";
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

const loader = useLoader();
const notif = useNotif();
const errorStore = useError();
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
    throw new Error(`Failed to get Survey Response: ${prettyJSON(res)}`);

  return res.data.response;
}

async function getTask(responseID: FeedbackResponseID) {
  const { res, err } = await sf
    .useDefault()
    .GET(`/task/of-response/${responseID}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyTaskDTO>();

  if (err) throw err;
  if (!res.ok) throw new Error(`Failed to get Tasks: ${prettyJSON(res)}`);

  return res.data.tasks;
}

const response = await getResponse(props.responseID);
const tasks = ref(await getTask(props.responseID));

/** Mapping to convert q1 answers stored as 1, 2, 3 in DB into text */
const a1WordMapping = { 3: "Very", 2: "Somewhat", 1: "Not" };

async function deleteTask(taskID: TaskID) {
  if (!confirm("Delete?")) return;
  loader.show();

  const result = await TaskController.deleteTask(taskID);

  if (result instanceof Error) {
    errorStore.newError(result);
  } else {
    tasks.value = tasks.value.filter((task) => task.id !== taskID);
    notif.setSnackbar("Task deleted!");
  }

  loader.hide();
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>Survey Response</TopNavbar>

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
          <p class="text-2xl">Generated Tasks</p>
          <p class="pb-4 font-light">
            A single survey response can cause more than 1 task to be generated.
          </p>

          <p
            v-if="tasks.length === 0"
            class="rounded-lg border border-zinc-200 p-3 text-lg font-light"
          >
            There is no tasks generated for this Survey Response.
          </p>

          <div
            v-for="(task, i) in tasks"
            :key="task.id"
            class="relative mb-4 rounded-lg border border-zinc-200 p-3 text-lg"
          >
            <div class="absolute right-0 top-0 flex flex-col font-light">
              <router-link
                :to="{ name: EditTaskRoute.name, params: { taskID: task.id } }"
                class="rounded-tr bg-zinc-200 px-4 text-zinc-800"
              >
                edit
              </router-link>
              <button
                class="rounded-bl-lg bg-red-100 px-2 text-red-800"
                @click="deleteTask(task.id)"
              >
                delete
              </button>
            </div>

            <p class="pr-12 font-light">{{ i + 1 }}. {{ task.task }}</p>
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
