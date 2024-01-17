import { ref } from "vue";

/**
 * Reactive `routerError` set when there is an error thrown during navigations,
 * and shown to user in root App.vue component.
 */
export const routerError = ref<Error | null>(null);
