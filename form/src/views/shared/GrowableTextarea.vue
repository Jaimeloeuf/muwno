<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  modelValue: string;
  rows: "2" | "3";
  placeholder?: string;
}>();

// Hard coded px height matching the specific row number
const defaultHeight = props.rows === "2" ? "76px" : "100px";

/** Ref to the DOM element */
const growableTextarea = ref<HTMLInputElement | null>(null);

/** Call on every input to resize the textarea to fit the input text */
function resize() {
  if (growableTextarea.value === null) return;

  // Set to default height minimally
  growableTextarea.value.style.height = defaultHeight;
  growableTextarea.value.style.height =
    growableTextarea.value.scrollHeight + "px";
}

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
  resize();
}
</script>

<template>
  <textarea
    ref="growableTextarea"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder ?? ''"
    @input="onInput"
  >
  </textarea>
</template>
