<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../../firebase";
import { useNotif } from "../../../../../store";
import type { ProductID, ReadManyTaskDTO, TaskID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const notif = useNotif();

async function getTasks() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/task/${props.productID}?count=3`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyTaskDTO>();

  if (err) throw err;
  if (!res.ok) throw new Error("Failed to load Tasks");

  return res.data.tasks;
}

async function markTaskAsDone(taskID: TaskID) {
  const { res, err } = await sf
    .useDefault()
    .POST(`/task/done/${taskID}`)
    .useHeader(getAuthHeader)
    .runVoid((res) => res.json());

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to mark Task as done. ${JSON.stringify(res)}`);

  notif.setSnackbar("Task completed! Updating task list ...");

  // Update list of tasks
  tasks.value = await getTasks();
}

const tasks = ref(await getTasks());
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <div class="flex flex-row items-center justify-between">
      <p class="text-sm font-semibold">Top 3 Tasks</p>
      <router-link
        v-if="tasks.length !== 0"
        :to="{}"
        class="rounded-lg bg-slate-400 p-1 px-3 text-sm font-semibold text-white"
      >
        See All
      </router-link>
    </div>

    <div v-if="tasks.length === 0" class="text-2xl font-thin">
      <!-- @todo Should also say all done if there are tasks jus all completed! -->
      This will be automatically generated once there are survey responses.
    </div>

    <div v-else>
      <!-- @todo Improve the UI to make it obvious that it is clickable -->
      <!-- @todo this should be click to toggle done state -->
      <!-- @todo Only see all details if they click into all detals -->

      <!-- @todo Add a 3 dot kinda details button thingy for them to click to see more details if not click to mark as complete -->
      <button
        v-for="(task, i) in tasks"
        :key="task.id"
        class="mt-3 block w-full rounded-lg border border-slate-300 p-2 text-left text-xl font-light hover:bg-white hover:shadow-xl"
        @click="markTaskAsDone(task.id)"
      >
        <span class="mr-2">{{ i + 1 }}.</span>
        {{ task.task }}
      </button>
    </div>
  </div>
</template>
