import { ref } from "vue";

class SideDrawerController {
  /**
   * Boolean flag to control if SideDrawer should be shown
   */
  showDrawer = ref(false);

  show() {
    this.showDrawer.value = true;
  }

  hide() {
    this.showDrawer.value = false;
  }
}

/**
 * Use a single shared instance of `SideDrawerController`
 */
export const sideDrawer = new SideDrawerController();
