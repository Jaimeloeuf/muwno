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
  <div class="inline-block w-full pb-2">
    <div class="flex flex-row items-center justify-between">
      <p class="text-sm font-semibold">Top Tasks</p>
      <!--
        Might not use this since we do not want to encourage users to use that
        and try to choose / priortize tasks themselves.
      -->
      <!-- <router-link
        v-if="tasks.length !== 0"
        :to="{}"
        class="rounded-lg bg-zinc-200 p-1 px-3 text-sm font-semibold text-white"
      >
        See All
      </router-link> -->
    </div>

    <div v-if="tasks.length === 0" class="text-2xl font-thin">
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

          <!-- @todo -->
          <router-link
            :to="{}"
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
