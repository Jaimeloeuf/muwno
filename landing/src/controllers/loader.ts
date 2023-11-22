import { ref } from "vue";

class LoaderController {
  /**
   * Boolean flag to control if Loader should be shown
   */
  showLoader = ref(false);

  show() {
    this.showLoader.value = true;
  }

  hide() {
    this.showLoader.value = false;
  }
}

/**
 * Use a single shared instance of `LoaderController`
 */
export const loader = new LoaderController();
