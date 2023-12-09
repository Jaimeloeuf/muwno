<script setup lang="ts">
import { ref } from "vue";
import { useNotif, useError } from "../../../../../store";
import { TaskController } from "../../../../../controller";
import { AllTaskRoute, SurveyResponseRoute } from "../../../../../router";
import type { ProductID, TaskID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const notif = useNotif();
const errorStore = useError();

async function markTaskAsDone(taskID: TaskID) {
  if (!confirm("Confirm?")) return;

  const result = await TaskController.markTaskAsDone(taskID);

  if (result instanceof Error) {
    errorStore.newError(result);
    return;
  }

  notif.setSnackbar("Task completed! Updating task list ...");

  // Update list of tasks
  tasks.value = await TaskController.getTasks(props.productID, 3);
}

const tasks = ref(await TaskController.getTasks(props.productID, 3));
</script>

<template>
  <div
    class="rounded-lg border border-zinc-200 p-3"
    :class="{ 'pb-0': tasks.length !== 0 }"
  >
    <div
      class="mb-2 flex flex-row items-center justify-between border-b border-zinc-200 pb-2"
    >
      <p class="font-medium">Tasks</p>
      <router-link
        v-if="tasks.length !== 0"
        :to="{ name: AllTaskRoute.name }"
        class="rounded-lg border border-zinc-200 p-1 px-6 text-sm font-light"
      >
        All
      </router-link>
    </div>

    <div v-if="tasks.length === 0" class="text-xl font-extralight">
      <!-- @todo Should also say all done if there are tasks jus all completed! -->
      This will be automatically generated once there are survey responses.
    </div>

    <div v-else class="divide-y divide-solid">
      <div v-for="(task, i) in tasks" :key="task.id" class="w-full p-1 py-2">
        <div class="mb-1 flex flex-row items-center justify-between gap-3">
          <p
            class="w-full font-light underline decoration-zinc-200 underline-offset-2"
          >
            Priority {{ i + 1 }}
          </p>

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
            class="rounded-lg border border-zinc-200 px-2 text-center font-extralight"
          >
            Details
          </router-link>

          <button
            class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 font-light"
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
