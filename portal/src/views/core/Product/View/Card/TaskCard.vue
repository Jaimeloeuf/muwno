<script setup lang="ts">
import { ref } from "vue";
import { useNotif } from "../../../../../store";
import { TaskController } from "../../../../../controller";
import { AllTaskRoute, SurveyResponseRoute } from "../../../../../router";
import type { ProductID, TaskID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const notif = useNotif();

async function markTaskAsDone(taskID: TaskID) {
  if (!confirm("Confirm?")) return;

  await TaskController.markTaskAsDone(taskID);

  notif.setSnackbar("Task completed! Updating task list ...");

  // Update list of tasks
  tasks.value = await TaskController.getTasks(props.productID, 3);
}

const tasks = ref(await TaskController.getTasks(props.productID, 3));
</script>

<template>
  <div
    class="mb-2 w-full"
    :class="{
      'pb-3': tasks.length !== 0,
      'rounded-lg border border-zinc-200 p-4': tasks.length === 0,
    }"
  >
    <div class="flex flex-row items-center justify-between">
      <p class="text-sm font-semibold">Top Tasks</p>
      <router-link
        v-if="tasks.length !== 0"
        :to="{ name: AllTaskRoute.name }"
        class="rounded-lg border border-zinc-200 p-1 px-6 text-sm text-zinc-700"
      >
        See All
      </router-link>
    </div>

    <div v-if="tasks.length === 0" class="pt-2 text-xl font-extralight">
      <!-- @todo Should also say all done if there are tasks jus all completed! -->
      This will be automatically generated once there are survey responses.
    </div>

    <div v-else>
      <div
        v-for="(task, i) in tasks"
        :key="task.id"
        class="mt-3 w-full rounded-lg border border-zinc-200 p-3"
      >
        <div
          class="mb-2 flex flex-row items-center justify-between gap-3 border-b border-zinc-200 pb-2"
        >
          <p class="w-full">Priority {{ i + 1 }}</p>

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
            class="w-full rounded-lg bg-zinc-100 font-light text-zinc-900"
            @click="markTaskAsDone(task.id)"
          >
            Done
          </button>
        </div>

        <p class="text-lg font-light">
          {{ task.task }}
        </p>
      </div>
    </div>
  </div>
</template>
