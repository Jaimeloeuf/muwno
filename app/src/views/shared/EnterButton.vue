<template>
  <!-- Using button to ensure that this element is 'tabbable' unlike using div -->
  <button
    class="flex w-full flex-row items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5"
  >
    <slot></slot>

    <svg
      class="h-3 w-3 shrink-0 rotate-90"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5 5 1 1 5"
      />
    </svg>
  </button>
</template>
