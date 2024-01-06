<script setup lang="ts">
import { ContactRoute, PricingRoute } from "../../router";

import { ref } from "vue";
import { loader } from "../../controllers";
import type { CreateOneContactFormSubmissionDTO } from "@domain-model";

const email = ref<string>("");

async function subscribe() {
  if (email.value === "") return alert("Please enter a valid email!");

  try {
    loader.show();

    const { getRecaptchaToken } = await import("../../recaptcha");
    const { sf } = await import("simpler-fetch");

    const { res, err } = await sf
      .useDefault()
      .POST("/landing/contact-form/submit")
      .useHeader({ "x-recaptcha-token": await getRecaptchaToken("contactUs") })
      .bodyJSON<CreateOneContactFormSubmissionDTO>({
        name: "-- NEWSLETTER SUBSCRIPTION --",
        email: email.value,
        message: "",
      })
      .runJSON();

    if (err) return console.error(`Error: ${err}`);
    if (!res.ok)
      return console.error(`Failed to subscribe: ${JSON.stringify(res)}`);

    if (res.status === 201) {
      alert("Subscribed!");
      email.value = "";
    }
  } catch (error) {
    console.error(`Failed to subscribe: ${error}`);
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div
    class="bg-zinc-100 px-8 py-8 md:py-12 lg:px-28 xl:px-32 xl:pb-20 2xl:px-48"
  >
    <div class="flex flex-col-reverse gap-8 pb-8 md:flex-row md:pb-20">
      <div class="flex flex-col gap-2 md:basis-1/4">
        <p class="tracking-wide">COMPANY</p>
        <router-link :to="{ name: ContactRoute.name }" class="w-max font-light">
          Contact us
        </router-link>
        <router-link :to="{ name: PricingRoute.name }" class="w-max font-light">
          Pricing
        </router-link>
        <a href="#" target="_blank" class="w-max font-light">About us</a>
        <a href="#" target="_blank" class="w-max font-light">Security</a>
        <a href="#" target="_blank" class="w-max font-light">Press kits</a>
        <a
          href="https://github.com/Jaimeloeuf/muwno"
          target="_blank"
          class="w-max font-light"
        >
          Open source
        </a>
      </div>

      <div class="md:basis-1/4">
        <p class="pb-2 tracking-wide">SOCIALS</p>
        <!-- @todo use env var -->
        <div class="flex flex-row flex-wrap gap-4 md:basis-1/4">
          <a href="https://www.linkedin.com/company/muwno/" target="_blank">
            <img src="../../assets/social-icons/li.svg" />
          </a>
          <a href="https://www.youtube.com/@muwno_ai" target="_blank">
            <img src="../../assets/social-icons/yt.svg" />
          </a>
          <a href="https://www.instagram.com/muwno.ai/" target="_blank">
            <img src="../../assets/social-icons/ig.svg" />
          </a>
          <a href="https://github.com/Jaimeloeuf/muwno" target="_blank">
            <img src="../../assets/social-icons/gh.svg" />
          </a>
          <a href="https://twitter.com/muwno_ai" target="_blank">
            <img src="../../assets/social-icons/tw.svg" />
          </a>
          <a href="https://www.reddit.com/user/muwno" target="_blank">
            <img src="../../assets/social-icons/rd.svg" />
          </a>
        </div>
      </div>

      <div class="md:basis-2/4">
        <p class="text-zinc-800">NEWSLETTER</p>
        <p class="pb-2 font-light">
          Get the latest news, industry trends and reports.
        </p>
        <div class="flex flex-row items-center gap-4">
          <input
            v-model.trim="email"
            type="text"
            class="w-full rounded-full border border-zinc-500 px-4 py-2 focus:outline-none"
            placeholder="Email"
          />

          <button
            class="rounded-full border border-zinc-300 bg-white px-4 py-2 outline-none"
            @click="subscribe"
          >
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center justify-between gap-6">
      <img src="../../assets/logo.svg" class="w-40" />

      <div class="flex flex-col text-right md:flex-row md:gap-3 lg:gap-6">
        <a
          href="/TC.pdf"
          target="_blank"
          class="text-sm text-zinc-600 underline decoration-zinc-600"
        >
          Terms & Conditions
        </a>

        <a
          href="/PP.pdf"
          target="_blank"
          class="text-sm text-zinc-600 underline decoration-zinc-600"
        >
          Privacy Policy
        </a>

        <a
          href="/DPN.pdf"
          target="_blank"
          class="text-sm text-zinc-600 underline decoration-zinc-600"
        >
          PDPA Data Protection Notice
        </a>
      </div>
    </div>
  </div>
</template>
