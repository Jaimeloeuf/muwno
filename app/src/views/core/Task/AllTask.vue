<script setup lang="ts">
import { ref } from "vue";
import { useNotif, useLoader, useError } from "../../../store";
import { SurveyResponseRoute } from "../../../router";
import { TaskController } from "../../../controller";
import { unwrapOrThrow } from "../../../utils";
import TopNavbar from "../../shared/TopNavbar.vue";
import type { ProductID, TaskID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const notif = useNotif();
const loader = useLoader();
const errorStore = useError();

const taskPerPage = 10;
const tasks = ref(
  unwrapOrThrow(await TaskController.getTasks(props.productID, taskPerPage))
);
const currentHeadIndex = ref<number>(1);

async function markTaskAsDone(taskID: TaskID) {
  if (!confirm("Confirm?")) return;

  const result = await TaskController.markTaskAsDone(taskID);

  if (result instanceof Error) {
    errorStore.newError(result);
    return;
  }

  notif.setSnackbar("Task completed! Updating task list ...");

  // Update the UI locally without reloading current page.
  tasks.value = tasks.value.filter((task) => task.id !== taskID);

  // Alternative that is always off by 1 because if using pagination method, as
  // DB will always skip 1 using current first task as page cursor.
  //
  // Get new page using current page's first task as page cursor again.
  // tasks.value = await TaskController.getTasks(
  //   props.productID,
  //   taskPerPage,
  //   tasks.value[0]?.id
  // );
}

async function previous() {
  // Automatically assume no more 'previous' tasks if index is reset to 1.
  if (currentHeadIndex.value === 1) {
    notif.setSnackbar("No more tasks!");
    return;
  }

  loader.show();

  const olderTasks = await TaskController.getTasks(
    props.productID,
    -taskPerPage,
    tasks.value[0]?.id
  );

  loader.hide();

  if (olderTasks instanceof Error) {
    errorStore.newError(olderTasks);
    return;
  }

  if (olderTasks.length === 0) {
    notif.setSnackbar("No more tasks!");
    return;
  }

  tasks.value = olderTasks;
  currentHeadIndex.value = currentHeadIndex.value - olderTasks.length;
}

async function next() {
  // Automatically assume no more 'next' tasks if number of current tasks less
  // than the standard requested page size.
  if (tasks.value.length < taskPerPage) {
    notif.setSnackbar("No more tasks!");
    return;
  }

  loader.show();

  const newTasks = await TaskController.getTasks(
    props.productID,
    taskPerPage,
    tasks.value.at(-1)?.id
  );

  loader.hide();

  if (newTasks instanceof Error) {
    errorStore.newError(newTasks);
    return;
  }

  if (newTasks.length === 0) {
    notif.setSnackbar("No more tasks!");
    return;
  }

  currentHeadIndex.value = currentHeadIndex.value + tasks.value.length;
  tasks.value = newTasks;
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>All Tasks</TopNavbar>

    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <div class="flex flex-col gap-3 md:flex-row">
        <p class="flex-grow text-lg font-extralight">
          Sorted by most important and oldest first
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
        v-for="(task, i) in tasks"
        :key="task.id"
        class="flex w-full flex-row rounded-lg border border-zinc-200 p-3"
      >
        <p class="flex-grow pb-2 text-lg font-light">
          <span class="pr-2">{{ i + currentHeadIndex }}.</span>{{ task.task }}
        </p>

        <div class="flex flex-col gap-3">
          <router-link
            :to="{
              name: SurveyResponseRoute.name,
              params: {
                productID,
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
