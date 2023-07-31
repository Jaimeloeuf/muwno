<script setup lang="ts">
//
</script>

<template>
  <!-- Navbar -->
  <div
    class="flex flex-row items-center justify-between bg-slate-50 p-4 lg:px-20"
  >
    <img src="../assets/logo.svg" class="sm:w-52" />

    <div>
      <button class="mr-6 rounded-3xl bg-green-800 px-8 py-2 text-white">
        Login
      </button>

      <button
        class="hidden rounded-3xl border-2 border-green-800 px-8 py-2 text-black md:inline-block"
      >
        Sign up
      </button>
    </div>
  </div>

  <!-- Hero section -->
  <div
    class="flex flex-row items-center justify-between bg-slate-200 px-10 py-16 md:px-24 lg:px-32"
  >
    <div class="mr-6 max-w-sm md:max-w-full md:basis-1/2">
      <p class="mb-4 text-3xl text-green-800 md:pb-3 md:text-4xl lg:text-5xl">
        We tell you what your customers would pay for
      </p>

      <p class="mb-4 md:text-lg lg:text-2xl">
        Measure progress towards Product Market Fit and get actionable insights
        with a PMF survey.
      </p>

      <div>
        <div
          class="flex max-w-lg flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0"
        >
          <button class="w-full rounded-3xl bg-green-800 px-7 py-2 text-white">
            Start
          </button>
          <button
            class="w-full rounded-3xl border-2 border-green-800 bg-white px-7 py-2 text-black"
          >
            Live Demo
          </button>
        </div>
      </div>
    </div>

    <div class="hidden bg-slate-200 md:inline-block md:basis-1/2">
      <img src="../assets/hero.svg" />
    </div>
  </div>

  <!-- PMF Description section -->
  <div
    class="flex flex-col bg-slate-100 p-10 md:px-24 md:py-20 lg:flex-row lg:space-x-12 lg:px-32"
  >
    <p class="mb-4 w-full text-2xl text-green-800 md:text-4xl">
      Product Market Fit (PMF)
    </p>

    <div class="md:text-xl">
      <p class="mb-2">
        PMF is having a <b>great product in the right market</b>, giving you
        high demand and ultimately <b>success</b> of your business.
      </p>
      <p>
        You've hit PMF when <b>40% or more</b> of your customers say they will
        be very disappointed if they cannot use your product anymore.
      </p>
    </div>
  </div>

  <div
    class="flex flex-col justify-between bg-slate-200 p-10 md:flex-row md:px-24 md:py-20 md:pb-0 lg:p-32 lg:pb-0"
  >
    <div class="mb-12 w-full md:mb-0">
      <p class="mb-2 text-2xl text-green-800 md:text-3xl lg:text-4xl">
        How thepmftool works
      </p>

      <p class="mb-4">Part 1</p>

      <p class="mb-2 text-xl md:text-2xl lg:text-3xl">
        Automatic Survey Collection
      </p>

      <p class="mb-1">
        Ditch your multiple tools (Google Forms + Mailchimp + Google Sheets +
        Tableau) setup.
      </p>

      <p class="mb-6">
        Intergrate your system with our tool to automatically survey your users
        to get feedback consistently and recurringly.
      </p>

      <button
        class="w-48 rounded-3xl bg-green-800 px-6 py-2 text-lg text-slate-50"
      >
        Create Survey
      </button>
    </div>

    <div class="w-full max-w-lg md:max-w-full">
      <img src="../assets/survey-collection.svg" />
    </div>
  </div>

  <div
    class="flex flex-col-reverse justify-between bg-slate-200 p-10 pt-0 md:flex-row md:px-24 md:py-20 lg:p-32"
  >
    <div class="w-full max-w-lg md:mb-0 md:max-w-full">
      <img src="../assets/data-analysis.svg" />
    </div>

    <div class="mb-12 w-full">
      <p class="mb-4">Part 2</p>

      <p class="mb-2 text-xl md:text-2xl lg:text-3xl">Data Analysis</p>

      <p class="mb-6">
        Know your PMF progress over time. Get actionable items with the help of
        our AI model that analyses your customers' feedback.
      </p>

      <button
        class="w-48 rounded-3xl bg-green-800 px-6 py-2 text-lg text-slate-50"
      >
        View Dashboard
      </button>
    </div>
  </div>

  <div class="bg-slate-100 px-10 py-20 md:px-24 lg:px-32">
    <div class="mb-6 max-w-2xl md:mb-12 lg:mb-20">
      <p class="text-2xl text-green-800 md:text-3xl lg:text-4xl">
        The PMF Survey has successfully helped companies like these grow
        <b>really fast.</b>
      </p>
    </div>

    <div
      class="grid grid-cols-3 items-center justify-between gap-4 sm:gap-8 md:gap-12 lg:gap-20 xl:gap-32 2xl:gap-64"
    >
      <img src="../assets/dropbox.svg" class="w-full" />
      <img src="../assets/eventbrite.svg" class="w-full" />
      <img src="../assets/superhuman.svg" class="w-full" />
    </div>
  </div>

  <div
    class="flex flex-col space-y-6 bg-slate-200 px-10 py-16 md:flex-row md:space-x-12 md:px-16 lg:px-32"
  >
    <p class="mb-3 w-full text-2xl text-green-800 md:text-3xl lg:text-4xl">
      Reach out to us when you are ready to growth hack your product to PMF!
    </p>

    <div class="flex w-full flex-col px-3 text-sm">
      <div
        class="mb-6 flex flex-col space-y-6 sm:flex-row sm:space-x-4 sm:space-y-0"
      >
        <label class="w-full tracking-wide">
          <p class="mb-2 font-bold text-gray-700">FIRST NAME</p>

          <input
            class="w-full appearance-none rounded border bg-gray-300 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            type="text"
            placeholder="Jane"
          />
        </label>

        <label class="w-full tracking-wide">
          <p class="mb-2 font-bold text-gray-700">LAST NAME</p>

          <input
            class="w-full appearance-none rounded border bg-gray-300 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            type="text"
            placeholder="Doe"
          />
        </label>
      </div>

      <label class="mb-6 w-full tracking-wide">
        <p class="mb-2 font-bold text-gray-700">EMAIL</p>

        <input
          class="w-full appearance-none rounded border bg-gray-300 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
          type="text"
          placeholder="janedoe@gmail.com"
        />
      </label>

      <label class="mb-6 w-full tracking-wide">
        <p class="mb-2 font-bold text-gray-700">YOUR MESSAGE</p>

        <textarea
          class="w-full resize-none appearance-none rounded border bg-gray-300 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
          rows="4"
          placeholder="I am ready to growth hack my product to PMF!"
        ></textarea>
      </label>

      <button
        class="w-40 rounded-3xl bg-green-800 px-6 py-2 text-lg text-slate-50"
      >
        Submit
      </button>
    </div>
  </div>

  <div
    class="flex flex-row justify-between bg-slate-50 p-10 md:items-center md:px-16 lg:px-32"
  >
    <div>
      <img src="../assets/logo.svg" class="md:w-40" />
    </div>

    <div class="flex flex-col md:flex-row md:space-x-3 lg:space-x-6">
      <a href="/TC.pdf" target="_blank" class="inline-block underline">
        Terms & Conditions
      </a>

      <a href="/PP.pdf" target="_blank" class="inline-block underline">
        Privacy Policy
      </a>

      <a href="/DPN.pdf" target="_blank" class="inline-block underline">
        PDPA Data Protection Notice
      </a>
    </div>
  </div>
</template>
