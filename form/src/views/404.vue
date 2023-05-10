<script setup lang="ts">
import { HomeRoute } from "../router";

const loc = window.location.toString();
</script>

<template>
  <div class="columns is-multiline mx-6 my-6">
    <div class="column is-full">
      <p class="title is-3">Page Not Found</p>
      <br />

      <p class="subtitle">"{{ loc }}"</p>

      <div class="columns is-vcentered">
        <div class="column">
          <p class="subtitle">
            The page you tried to look for does not exists!
          </p>
        </div>

        <div class="column is-narrow">
          <!-- @todo -->
          <a
            href=""
            target="_blank"
            class="button is-light is-warning is-fullwidth"
          >
            report issue
          </a>
        </div>
      </div>
    </div>

    <div class="column is-full">
      <hr />
    </div>

    <div class="column is-half">
      <button
        class="button is-light is-warning is-fullwidth"
        @click="$router.back"
      >
        Back
      </button>
    </div>

    <div class="column is-half">
      <router-link
        class="button is-light is-success is-fullwidth"
        :to="{ name: HomeRoute.name }"
      >
        Home
      </router-link>
    </div>
  </div>
</template>
