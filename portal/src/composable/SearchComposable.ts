import { ref, computed } from "vue";
import Fuse from "fuse.js";

type SearchOptions = {
  keys: Array<string>;

  /**
   * Use this to limit max number of search results returned to lower spec
   * devices can keep up with the rendering, especially at the start of search
   * where alot of results will be matched when a few characters are entered.
   */
  resultLimit: number;

  /**
   * When to give up search. A 0.0 threshold requires a perfect match of both
   * letters and location, while a threshold of 1.0 would match anything.
   */
  threshold: number;
};

/**
 * Composable to encapsulate commonly used search logic built with `fuse.js` lib
 */
export function useSearch<T>(
  searchables: Array<T>,
  searchOptions: SearchOptions,
  clearSearchInputHandler: () => unknown
) {
  /** Search Input string variable that is mapped to the search input box */
  const searchInput = ref<string>("");

  /** Create Fuse object and use computed to update on search input update */
  const fuse = computed(
    () =>
      new Fuse(searchables, {
        keys: searchOptions.keys,
        threshold: searchOptions.threshold,
      })
  );

  /** Continously search as user input changes. */
  const results = computed(() =>
    searchInput.value === ""
      ? searchables
      : fuse.value
          .search(searchInput.value, { limit: searchOptions.resultLimit })
          .map((result) => result.item)
  );

  /**
   * Clears `searchInput` and calls user provided handler.
   * User can choose to re-focus on the search field in their own handler.
   */
  function clearSearchInput() {
    searchInput.value = "";
    clearSearchInputHandler();
  }

  // expose managed state as return value
  return { searchInput, results, clearSearchInput };
}
