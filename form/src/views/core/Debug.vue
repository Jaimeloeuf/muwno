<script setup lang="ts">
import { sf } from "simpler-fetch";
import { API, baseApiUrl } from "../../API";
import Version from "../components/Version.vue";

const { res, err } = await sf.useBase(API.vNeutral).GET("/version").runText();
</script>

<template>
  <div class="mx-6 flex h-screen flex-col justify-center">
    <div class="mb-6 text-2xl">Debug</div>

    <div class="mb-6 rounded-lg border border-slate-300 p-3">
      Base API URL {{ baseApiUrl }}
    </div>

    <div class="mb-6 rounded-lg border border-slate-300 p-3">
      API call test
      <hr class="my-2" />

      <div v-if="res !== undefined" class="rounded-lg bg-slate-100 p-2">
        res: {{ JSON.stringify(res) }}
      </div>
      <div v-if="err !== undefined" class="rounded-lg bg-slate-100 p-2">
        err: {{ err }}
      </div>
    </div>

    <div class="rounded-lg border border-slate-300 p-3">
      <Version />
    </div>
  </div>
</template>
