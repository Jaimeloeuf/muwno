<script setup lang="ts">
import { ref, watch } from "vue";
import { useOrg } from "../../store";
import { OrgRoute, ProductRoute, ProfileRoute } from "../../router";
import { logout } from "../../utils/logout";
import Version from "./Version.vue";

const orgStore = useOrg();

const showDrawer = ref<boolean>(false);
const showProducts = ref<boolean>(true);

const showVersionCount = ref<number>(0);
watch(showDrawer, (shown) => {
  if (!shown) showVersionCount.value = 0;
});
</script>

<template>
  <button
    type="button"
    class="m-1 mt-2 inline-flex rounded-lg text-sm text-gray-500"
    @click="showDrawer = !showDrawer"
  >
    <svg
      class="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      />
    </svg>
  </button>

  <!--
    Custom invisible overlay across the entire screen to simulate click away
    from side drawer to close it. Using custom w/h instead of h-screen w-screen
    to prevent the screen from growing.
  -->
  <div
    v-if="showDrawer"
    class="absolute z-40 h-[96vh] w-[96vw]"
    @click="showDrawer = false"
  ></div>

  <aside
    class="fixed left-0 top-0 z-40 h-screen w-9/12 max-w-sm -translate-x-full transition-transform"
    :class="{ 'translate-x-0': showDrawer, 'shadow-2xl': showDrawer }"
  >
    <div
      class="flex h-full flex-col items-start justify-between space-y-2 bg-gray-50 p-4 font-medium"
    >
      <p class="p-2 text-gray-900" @click="showDrawer = false">
        <span class="text-2xl">Product Market Fit</span>
        <span class="ml-3 text-3xl">📈📈📈</span>
      </p>

      <div class="w-full">
        <router-link
          :to="{ name: OrgRoute.name }"
          class="group flex w-full rounded-lg p-2 text-gray-900 transition duration-75"
          @click="showDrawer = !showDrawer"
        >
          <svg
            class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ml-3 flex-1 text-left">Organisation</span>
        </router-link>

        <button
          type="button"
          class="group flex w-full rounded-lg p-2 text-gray-900 transition duration-75"
          @click="showProducts = !showProducts"
        >
          <svg
            class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ml-3 flex-1 text-left">Products</span>
          <svg
            class="h-6 w-6"
            :class="{ '-rotate-90': !showProducts }"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div class="mt-2 space-y-2" :class="{ hidden: !showProducts }">
          <div
            v-for="(product, i) in orgStore.productsArray"
            :key="i"
            class="flex flex-row"
          >
            <router-link
              :to="{
                name: ProductRoute.name,
                params: { productID: product.id },
              }"
              class="inline-flex grow rounded-lg p-2 pl-7 pr-4 text-gray-900 transition duration-75"
              :class="{
                // @todo Should check by route param instead
                // 'bg-gray-200': product.id === orgStore.currentProductID,
              }"
              @click="showDrawer = !showDrawer"
            >
              {{ i + 1 }}. {{ product.name }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Spacer divider that takes up all the space in the middle -->
      <div class="grow"></div>

      <router-link
        :to="{ name: ProfileRoute.name }"
        class="flex w-full p-2 pb-0 text-start text-gray-700"
      >
        <svg
          class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.44444 3.55556C4.44444 2.61256 4.81905 1.70819 5.48584 1.0414C6.15264 0.374602 7.05701 0 8 0C8.94299 0 9.84736 0.374602 10.5142 1.0414C11.181 1.70819 11.5556 2.61256 11.5556 3.55556C11.5556 4.49855 11.181 5.40292 10.5142 6.06971C9.84736 6.73651 8.94299 7.11111 8 7.11111C7.05701 7.11111 6.15264 6.73651 5.48584 6.06971C4.81905 5.40292 4.44444 4.49855 4.44444 3.55556ZM4.44444 8.88889C3.2657 8.88889 2.13524 9.35714 1.30175 10.1906C0.468253 11.0241 0 12.1546 0 13.3333C0 14.0406 0.280952 14.7189 0.781049 15.219C1.28115 15.719 1.95942 16 2.66667 16H13.3333C14.0406 16 14.7189 15.719 15.219 15.219C15.719 14.7189 16 14.0406 16 13.3333C16 12.1546 15.5317 11.0241 14.6983 10.1906C13.8648 9.35714 12.7343 8.88889 11.5556 8.88889H4.44444Z"
            fill="black"
          />
        </svg>

        <span class="ml-3 flex-1">Profile</span>
      </router-link>

      <button
        class="flex w-full p-2 pb-0 text-start text-gray-700"
        @click="showVersionCount++"
      >
        <svg
          class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.4712 8.6639V7.7634L15.6012 6.77461C15.8095 6.591 15.9462 6.33967 15.9871 6.06503C16.0281 5.79039 15.9706 5.51013 15.8249 5.27376L14.4358 2.9195C14.3326 2.74073 14.1842 2.59225 14.0055 2.48894C13.8268 2.38564 13.6241 2.33115 13.4176 2.33094C13.2897 2.32996 13.1625 2.34984 13.0409 2.38979L11.6107 2.87242C11.3638 2.70833 11.1062 2.56086 10.8397 2.43099L10.5395 0.947807C10.4857 0.676834 10.3383 0.433424 10.1231 0.260187C9.90791 0.0869497 9.63863 -0.00507708 9.36241 0.000216257H6.60793C6.33171 -0.00507708 6.06243 0.0869497 5.84723 0.260187C5.63203 0.433424 5.48462 0.676834 5.43079 0.947807L5.13063 2.43099C4.8622 2.56083 4.60266 2.70829 4.35372 2.87242L2.95293 2.36625C2.8301 2.33425 2.70289 2.32232 2.57625 2.33094C2.36983 2.33115 2.16709 2.38564 1.98837 2.48894C1.80965 2.59225 1.66124 2.74073 1.55803 2.9195L0.169016 5.27376C0.0316375 5.50977 -0.0194119 5.7862 0.0246114 6.05571C0.0686347 6.32522 0.204991 6.57104 0.410328 6.75106L1.52272 7.76928V8.66979L0.410328 9.65858C0.199191 9.83986 0.0591049 10.0901 0.0149291 10.3648C-0.0292468 10.6396 0.0253451 10.9211 0.169016 11.1594L1.55803 13.5137C1.66124 13.6925 1.80965 13.8409 1.98837 13.9442C2.16709 14.0475 2.36983 14.102 2.57625 14.1022C2.70417 14.1032 2.8314 14.0833 2.95293 14.0434L4.38315 13.5608C4.63007 13.7249 4.88765 13.8723 5.15417 14.0022L5.45434 15.4854C5.50816 15.7564 5.65557 15.9998 5.87077 16.173C6.08598 16.3462 6.35525 16.4383 6.63147 16.433H9.4095C9.68571 16.4383 9.95499 16.3462 10.1702 16.173C10.3854 15.9998 10.5328 15.7564 10.5866 15.4854L10.8868 14.0022C11.1552 13.8724 11.4148 13.7249 11.6637 13.5608L13.088 14.0434C13.2096 14.0833 13.3368 14.1032 13.4647 14.1022C13.6711 14.102 13.8739 14.0475 14.0526 13.9442C14.2313 13.8409 14.3797 13.6925 14.4829 13.5137L15.8249 11.1594C15.9622 10.9234 16.0133 10.647 15.9693 10.3775C15.9252 10.108 15.7889 9.86215 15.5836 9.68212L14.4712 8.6639ZM13.4176 12.9251L11.3989 12.2424C10.9263 12.6427 10.3862 12.9556 9.80384 13.1664L9.38596 15.2794H6.60793L6.19004 13.19C5.61232 12.9731 5.07513 12.6608 4.60092 12.2659L2.57625 12.9251L1.18723 10.5709L2.78813 9.1583C2.67931 8.54905 2.67931 7.92534 2.78813 7.31609L1.18723 5.86233L2.57625 3.50807L4.59503 4.1908C5.06761 3.79052 5.60772 3.47761 6.19004 3.26676L6.60793 1.1538H9.38596L9.80384 3.24321C10.3816 3.46005 10.9187 3.77242 11.393 4.16726L13.4176 3.50807L14.8066 5.86233L13.2057 7.27489C13.3146 7.88414 13.3146 8.50785 13.2057 9.1171L14.8066 10.5709L13.4176 12.9251Z"
            fill="black"
          />
          <path
            d="M7.99694 11.7481C7.2985 11.7481 6.61574 11.541 6.035 11.1529C5.45427 10.7649 5.00164 10.2134 4.73436 9.5681C4.46708 8.92283 4.39714 8.21278 4.5334 7.52776C4.66966 6.84273 5.00599 6.2135 5.49987 5.71963C5.99374 5.22575 6.62298 4.88942 7.308 4.75316C7.99302 4.6169 8.70307 4.68683 9.34835 4.95412C9.99363 5.2214 10.5452 5.67403 10.9332 6.25476C11.3212 6.8355 11.5283 7.51825 11.5283 8.2167C11.5331 8.68176 11.4449 9.14309 11.2691 9.57367C11.0933 10.0043 10.8334 10.3954 10.5045 10.7243C10.1757 11.0532 9.7845 11.3131 9.35391 11.4889C8.92333 11.6647 8.462 11.7528 7.99694 11.7481ZM7.99694 5.86244C7.68579 5.85519 7.37641 5.91113 7.0875 6.02688C6.79859 6.14262 6.53616 6.31577 6.31609 6.53584C6.09601 6.75592 5.92287 7.01835 5.80712 7.30726C5.69137 7.59616 5.63543 7.90555 5.64268 8.2167C5.63543 8.52785 5.69137 8.83723 5.80712 9.12614C5.92287 9.41505 6.09601 9.67748 6.31609 9.89755C6.53616 10.1176 6.79859 10.2908 7.0875 10.4065C7.37641 10.5223 7.68579 10.5782 7.99694 10.571C8.30809 10.5782 8.61747 10.5223 8.90638 10.4065C9.19529 10.2908 9.45772 10.1176 9.6778 9.89755C9.89787 9.67748 10.071 9.41505 10.1868 9.12614C10.3025 8.83723 10.3585 8.52785 10.3512 8.2167C10.3585 7.90555 10.3025 7.59616 10.1868 7.30726C10.071 7.01835 9.89787 6.75592 9.6778 6.53584C9.45772 6.31577 9.19529 6.14262 8.90638 6.02688C8.61747 5.91113 8.30809 5.85519 7.99694 5.86244Z"
            fill="black"
          />
        </svg>

        <span class="ml-3 flex-1">Settings</span>
      </button>

      <a class="flex w-full p-2 pb-0 text-start text-gray-700" target="_blank">
        <svg
          class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.96 12.8C8.24 12.8 8.4768 12.7032 8.6704 12.5096C8.864 12.316 8.96053 12.0795 8.96 11.8C8.96 11.52 8.86347 11.2832 8.6704 11.0896C8.47733 10.896 8.24053 10.7995 7.96 10.8C7.68 10.8 7.44347 10.8968 7.2504 11.0904C7.05733 11.284 6.96053 11.5205 6.96 11.8C6.96 12.08 7.0568 12.3168 7.2504 12.5104C7.444 12.704 7.68053 12.8005 7.96 12.8ZM7.24 9.72H8.72C8.72 9.28 8.77013 8.93333 8.8704 8.68C8.97067 8.42667 9.25387 8.08 9.72 7.64C10.0667 7.29333 10.34 6.9632 10.54 6.6496C10.74 6.336 10.84 5.95947 10.84 5.52C10.84 4.77333 10.5667 4.2 10.02 3.8C9.47333 3.4 8.82667 3.2 8.08 3.2C7.32 3.2 6.7032 3.4 6.2296 3.8C5.756 4.2 5.42613 4.68 5.24 5.24L6.56 5.76C6.62667 5.52 6.7768 5.26 7.0104 4.98C7.244 4.7 7.60053 4.56 8.08 4.56C8.50667 4.56 8.82667 4.6768 9.04 4.9104C9.25333 5.144 9.36 5.40053 9.36 5.68C9.36 5.94667 9.28 6.1968 9.12 6.4304C8.96 6.664 8.76 6.88053 8.52 7.08C7.93333 7.6 7.57333 7.99333 7.44 8.26C7.30667 8.52667 7.24 9.01333 7.24 9.72ZM8 16C6.89333 16 5.85333 15.7899 4.88 15.3696C3.90667 14.9493 3.06 14.3795 2.34 13.66C1.62 12.94 1.05013 12.0933 0.6304 11.12C0.210667 10.1467 0.000533333 9.10667 0 8C0 6.89333 0.210133 5.85333 0.6304 4.88C1.05067 3.90667 1.62053 3.06 2.34 2.34C3.06 1.62 3.90667 1.05013 4.88 0.6304C5.85333 0.210667 6.89333 0.000533333 8 0C9.10667 0 10.1467 0.210133 11.12 0.6304C12.0933 1.05067 12.94 1.62053 13.66 2.34C14.38 3.06 14.9501 3.90667 15.3704 4.88C15.7907 5.85333 16.0005 6.89333 16 8C16 9.10667 15.7899 10.1467 15.3696 11.12C14.9493 12.0933 14.3795 12.94 13.66 13.66C12.94 14.38 12.0933 14.9501 11.12 15.3704C10.1467 15.7907 9.10667 16.0005 8 16ZM8 14.4C9.78667 14.4 11.3 13.78 12.54 12.54C13.78 11.3 14.4 9.78667 14.4 8C14.4 6.21333 13.78 4.7 12.54 3.46C11.3 2.22 9.78667 1.6 8 1.6C6.21333 1.6 4.7 2.22 3.46 3.46C2.22 4.7 1.6 6.21333 1.6 8C1.6 9.78667 2.22 11.3 3.46 12.54C4.7 13.78 6.21333 14.4 8 14.4Z"
            fill="black"
          />
        </svg>

        <span class="ml-3 flex-1">Help me!</span>
      </a>

      <button
        class="flex w-full p-2 pb-0 text-start text-gray-700"
        @click="logout()"
      >
        <svg
          class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.7778 4.55556V2.77778C10.7778 2.30628 10.5905 1.8541 10.2571 1.5207C9.92368 1.1873 9.4715 1 9 1H2.77778C2.30628 1 1.8541 1.1873 1.5207 1.5207C1.1873 1.8541 1 2.30628 1 2.77778V13.4444C1 13.9159 1.1873 14.3681 1.5207 14.7015C1.8541 15.0349 2.30628 15.2222 2.77778 15.2222H9C9.4715 15.2222 9.92368 15.0349 10.2571 14.7015C10.5905 14.3681 10.7778 13.9159 10.7778 13.4444V11.6667"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.33333 8.111H17M17 8.111L14.3333 5.44434M17 8.111L14.3333 10.7777"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="ml-3 flex-1">Logout</span>
      </button>

      <br />

      <Version v-if="showVersionCount > 2" />
    </div>
  </aside>
</template>
