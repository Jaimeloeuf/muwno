<script setup lang="ts">
import { sf } from "simpler-fetch";
import { API, baseApiUrl } from "../../API";
import Version from "../shared/Version.vue";

const { res, err } = await sf.useBase(API.vNeutral).GET("/version").runText();
</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="mb-6 text-2xl">Debug</div>

    <div class="mb-6 rounded-lg border border-zinc-200 p-3">
      Base API URL {{ baseApiUrl }}
    </div>

    <div class="mb-6 rounded-lg border border-zinc-200 p-3">
      API call test
      <hr class="my-2" />

      <div
        v-if="res !== undefined"
        class="rounded-lg bg-zinc-100 p-2 text-zinc-900"
      >
        res: {{ JSON.stringify(res) }}
      </div>
      <div
        v-if="err !== undefined"
        class="rounded-lg bg-zinc-100 p-2 text-zinc-900"
      >
        err: {{ err }}
      </div>
    </div>

    <div class="rounded-lg border border-zinc-200 p-3">
      <Version />
    </div>
  </div>
</template>
