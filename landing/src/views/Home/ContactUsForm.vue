<script setup lang="ts">
import { ref } from "vue";
import { useLoader } from "../../store";
import type { CreateOneContactFormSubmissionDTO } from "@domain-model";

const loader = useLoader();

const name = ref<string>("");
const email = ref<string>("");
const message = ref<string>("");

async function submitMessage() {
  if (name.value === "") return alert("Please enter a valid name!");
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
        name: name.value,
        email: email.value,
        message: message.value,
      })
      .runJSON();

    if (err) return alert(`Error: ${err}`);
    if (!res.ok)
      return alert(`Failed to submit message: ${JSON.stringify(res)}`);
    if (res.status === 201)
      return alert("Message sent! We will get back to you as soon as possible");
  } catch (error) {
    alert(`Failed to submit message: ${error}`);
  } finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="px-6 py-12 md:px-12 md:py-24 lg:px-16 xl:px-24">
    <p
      class="pb-4 text-3xl font-extrabold text-zinc-600 md:pb-8 md:text-4xl lg:text-5xl"
    >
      Start Earning
      <span class="rounded-lg bg-yellow-300 px-2 text-zinc-700 shadow">
        More
      </span>
    </p>

    <p
      class="pb-4 font-light tracking-wider text-zinc-600 md:pb-8 md:text-lg lg:text-2xl"
    >
      Reach out to us!
    </p>

    <div class="flex flex-row items-center justify-between gap-12">
      <div class="w-full">
        <div class="w-full pb-3 tracking-wide md:pb-6">
          <label>
            <p class="mb-2 font-bold text-zinc-700">Name</p>

            <input
              v-model.trim="name"
              class="w-full appearance-none rounded border bg-zinc-50 px-4 py-3 leading-tight text-zinc-700 focus:outline-none"
              type="text"
              placeholder="Jane Doe"
            />
          </label>
        </div>

        <div class="w-full pb-3 tracking-wide md:pb-6">
          <label>
            <p class="mb-2 font-bold text-zinc-700">Email</p>

            <input
              v-model.trim="email"
              class="w-full appearance-none rounded border bg-zinc-50 px-4 py-3 leading-tight text-zinc-700 focus:outline-none"
              type="text"
              placeholder="janedoe@gmail.com"
              @keydown.enter="submitMessage"
            />
          </label>
        </div>

        <div class="w-full tracking-wide">
          <label>
            <p class="mb-2 font-bold text-zinc-700">Your Message</p>

            <textarea
              v-model.trim="message"
              class="w-full resize-none appearance-none rounded border bg-zinc-50 px-4 py-3 leading-tight text-zinc-700 focus:outline-none"
              rows="4"
              placeholder="I need to reach Product Market Fit!"
            ></textarea>
          </label>
        </div>
      </div>

      <img
        class="hidden w-full lg:block lg:max-w-sm xl:max-w-2xl"
        src="../../assets/MoneyBag.svg"
      />
    </div>

    <p class="pb-4 text-xs font-thin">
      This site is protected by reCAPTCHA and the Google
      <a
        target="_blank"
        class="text-blue-800"
        href="https://policies.google.com/privacy"
      >
        Privacy Policy
      </a>
      and
      <a
        target="_blank"
        class="text-blue-800"
        href="https://policies.google.com/terms"
      >
        Terms of Service
      </a>
      apply.
    </p>

    <button
      class="rounded-full bg-primary px-10 py-3 font-semibold tracking-wider text-white"
      @click="submitMessage"
    >
      SUBMIT
    </button>
  </div>
</template>
