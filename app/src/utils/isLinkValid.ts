import { computed, type Ref } from "vue";

export function isLinkValid(link: string | null) {
  try {
    if (link === null) return false;
    new URL(link);
    return true;
  } catch (_) {
    return false;
  }
}

export const isLinkValidReactive = (link: Ref<string | null>) =>
  computed(() => isLinkValid(link.value));
