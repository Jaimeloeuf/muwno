<script setup lang="ts">
defineProps<{ globalError: Error }>();

defineEmits(["acknowledged"]);
</script>

<template>
  <div class="section">
    <div class="columns is-mobile is-multiline">
      <div class="column is-full">
        <h2 class="title">Page Error!</h2>
      </div>

      <div class="column is-narrow">
        <!-- @todo -->
        <a href="" class="button is-light is-warning is-fullwidth"> report </a>
      </div>

      <div class="column">
        <button
          class="button is-light is-success is-fullwidth"
          @click="$emit('acknowledged')"
        >
          back
        </button>
      </div>

      <div class="column is-full">
        <div class="box" style="word-wrap: break-word">{{ globalError }}</div>
      </div>
    </div>
  </div>
</template>
