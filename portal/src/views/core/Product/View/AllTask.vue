<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import { useNotif } from "../../../../store";
import { SurveyResponseRoute } from "../../../../router";
import { TaskController } from "../../../../controller";
import BackButton from "../../../components/BackButton.vue";
import type { ProductID, TaskID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const notif = useNotif();

async function markTaskAsDone(taskID: TaskID) {
  if (!confirm("Confirm?")) return;

  await TaskController.markTaskAsDone(taskID);

  notif.setSnackbar("Task completed! Updating task list ...");

  // Update list of tasks
  tasks.value = await TaskController.getTasks(props.productID, 10);
}

const tasks = ref(await TaskController.getTasks(props.productID, 10));
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row items-center border-b pb-4">
      <BackButton />
      <span class="ml-4 text-4xl">All Tasks</span>
    </div>

    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <p class="text-lg font-extralight">Sorted by importance score and date</p>

      <div
        v-for="(task, i) in tasks"
        :key="task.id"
        class="flex w-full flex-row rounded-lg border border-zinc-200 p-3"
      >
        <p class="flex-grow pb-2 text-lg font-light">
          <span class="pr-2">{{ i + 1 }}.</span>{{ task.task }}
        </p>

        <div class="flex flex-col gap-3">
          <router-link
            :to="{
              name: SurveyResponseRoute.name,
              params: {
                productID: task.productID,
                responseID: task.responseID,
              },
              query: {
                taskID: task.id,
              },
            }"
            class="rounded-lg border border-zinc-200 px-3 text-center font-light text-zinc-900"
          >
            Details
          </router-link>

          <button
            class="rounded-lg bg-zinc-100 px-3 font-light text-zinc-900"
            @click="markTaskAsDone(task.id)"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
