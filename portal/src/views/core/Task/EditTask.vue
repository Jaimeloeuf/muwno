<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNotif, useLoader, useError } from "../../../store";
import { TaskController } from "../../../controller";
import TopNavbar from "../../shared/TopNavbar.vue";
import type { TaskID } from "@domain-model";

const props = defineProps<{ taskID: TaskID }>();

const router = useRouter();
const notif = useNotif();
const loader = useLoader();
const errorStore = useError();

const task = ref(await TaskController.getTask(props.taskID));
const newTask = ref<string>(task.value.task);

async function update() {
  loader.show();

  const result = await TaskController.updateTask(task.value.id, newTask.value);

  loader.hide();

  if (result instanceof Error) {
    errorStore.newError(result);
  } else {
    router.back();
    notif.setSnackbar("Task updated!");
  }
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>Edit Task</TopNavbar>

    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <div class="pb-6">
        <p class="pb-2">Original Task</p>

        <div
          class="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-light"
        >
          {{ task.task }}
        </div>
      </div>

      <div class="pb-6">
        <p class="pb-2">New Task</p>

        <textarea
          v-model="newTask"
          rows="4"
          class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light focus:outline-none"
        >
        </textarea>
      </div>

      <button
        class="mx-auto w-full max-w-sm rounded-lg border border-green-600 p-3 text-green-600"
        @click="update"
      >
        Update
      </button>
    </div>
  </div>
</template>
