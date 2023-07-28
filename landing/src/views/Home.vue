<script setup lang="ts">
//
</script>

<template>
  <div class="bg-slate-50">
    <div class="flex flex-row justify-between items-center md:p-4 p-6">
      <img src="../assets/logot.svg" class="md:w-52 md:ml-20" />

      <div>
        <button class="mr-6 bg-green-800 h-12 text-white py-3 px-8 rounded-3xl">
          Login
        </button>

        <button
          class="mr-6 h-12 text-black py-3 px-8 rounded-3xl border-2 border-green-800 hidden md:inline-block"
        >
          Sign up
        </button>
      </div>
    </div>
  </div>

  <div class="flex flex-row">
    <div class="bg-slate-200 py-10 md:py-32 md:px-6 md:w-1/2">
      <p
        class="text-green-800 text-2xl text-center md:px-16 md:text-left md:text-5xl md:leading-snug md:pb-3"
      >
        We tell you what your <br />
        customers would pay for
      </p>

      <p
        class="text-sm text-center p-8 pt-3 pb-3 mb-4 md:text-2xl md:px-16 md:text-left md:pb-6"
      >
        Measure progress towards Product Market Fit and get actionable insights
        with a PMF survey.
      </p>

      <div
        class="flex flex-col space-y-4 items-center md:flex-row md:space-y-0 md:space-x-4 md:px-16"
      >
        <button
          class="bg-green-800 text-white py-2 px-7 rounded-3xl w-30 md:h-12"
        >
          Create Survey
        </button>
        <button
          class="bg-white text-black border-2 border-green-800 py-2 px-7 rounded-3xl w-40 md:h-12"
        >
          Live Demo
        </button>
      </div>
    </div>

    <div class="hidden bg-slate-200 md:w-1/2 md:py-24 md:inline-block">
      <img src="../assets/hero.svg" class="w-auto" />
    </div>
  </div>

  <div class="md:flex flex-row">
    <div class="bg-slate-100 py-6 md:py-20 md:w-2/5">
      <p
        class="text-green-800 text-2xl text-center md:px-24 md:text-left md:text-4xl md:leading-snug md:pb-3"
      >
        Product Market Fit (PMF)
      </p>
    </div>

    <div class="bg-slate-100 md:px-24 md:py-24 md:w-3/5">
      <p
        class="text-sm text-center p-8 pt-0 md:px-16 md:text-left md:text-xl md:leading-snug"
      >
        PMF is having a <b>great product in the right market</b>, giving you
        high demand and ultimately <b>success</b> of your business. <br /><br />
        You've hit PMF when <b>40% or more</b> of your customers say they will
        be very disappointed if they cannot use your product anymore.
      </p>
    </div>
  </div>

  <div class="md:flex flex-row">
    <div class="bg-slate-200 py-10 md:py-32 md:px-6 md:w-1/2">
      <p
        class="text-green-800 text-2xl text-center pb-3 md:px-16 md:text-left md:text-4xl md:leading-snug md:pb-3"
      >
        How theprodtool works
      </p>

      <p
        class="hidden md:inline-block visible text-base text-center p-5 mb-4 md:text-base md:px-16 md:text-left md:pb-2"
      >
        01/
      </p>

      <p
        class="text-base text-center md:px-16 md:text-left md:text-3xl md:pb-6"
      >
        Automatic Survey Collection
      </p>

      <p
        class="text-sm text-center p-8 pt-3 md:px-16 md:text-left md:text-xl md:leading-snug md:pb-8"
      >
        Ditch your multiple tools (Google Forms+ Mailchimp+ Google Sheets+
        Tableau) setup. <br /><br />
        Intergrate your system with our tool to automatically survey your users
        to get feedback consistently and recurringly.
      </p>

      <div
        class="flex flex-col space-y-4 items-center md:flex-row md:space-y-0 md:space-x-4 md:px-16"
      >
        <button
          class="bg-green-800 text-white py-2 px-7 rounded-3xl w-40 md:h-12"
        >
          Create Survey
        </button>
      </div>
    </div>
    <div class="bg-slate-200 md:w-1/2 md:py-24">
      <img src="../assets/hero.svg" class="w-auto" />
    </div>
  </div>

  <div class="md:flex flex-row">
    <div class="hidden bg-slate-200 md:w-1/2 md:py-24 md:inline-block">
      <img src="../assets/hero.svg" class="w-auto" />
    </div>

    <div class="bg-slate-200 py-10 md:py-32 md:px-6 md:w-1/2">
      <p></p>

      <p
        class="hidden md:inline-block visible text-base text-center p-5 mb-4 md:text-base md:px-16 md:text-left md:pb-2"
      >
        /02
      </p>

      <p
        class="text-base text-center md:px-16 md:text-left md:text-3xl md:pb-6"
      >
        Data Analysis
      </p>

      <p
        class="text-sm text-center p-8 pt-3 md:px-16 md:text-left md:text-xl md:leading-snug md:pb-6"
      >
        Know your PMF progress over time. Get actionable items with the help of
        our AI model that analyses your customers' feedback.
      </p>

      <div
        class="flex flex-col space-y-4 items-center md:flex-row md:space-y-0 md:space-x-4 md:px-16"
      >
        <button
          class="bg-green-800 text-white py-2 px-7 rounded-3xl md:w-44 md:h-12"
        >
          View Dashboard
        </button>
      </div>
    </div>
    <div class="bg-slate-200 md:w-1/2 md:py-24 md:hidden">
      <img src="../assets/hero.svg" class="w-auto" />
    </div>
  </div>

  <div class="bg-slate-100">
    <div class="bg-slate-100 py-6 md:pt-20 md:w-2/3 pb-0">
      <p
        class="text-green-800 text-xl text-center md:px-24 md:text-left md:leading-snug md:text-4xl md:pb-0"
      >
        The PMF Survey has been proven successful by companies like
      </p>
    </div>

    <div class="flex flex-row md:justify-evenly pt-0 bg-slate-100 md:align-top">
      <img src="../assets/dropbox.svg" class="md:w-1/3 w-32" />
      <img src="../assets/eventbrite.svg" class="md:w-1/3 w-32" />
      <img src="../assets/superhuman.svg" class="md:w-1/3 w-32" />
    </div>
  </div>

  <div class="md:flex flex-row">
    <div class="bg-slate-200 py-6 md:py-20 md:w-2/5">
      <p
        class="text-green-800 text-xl text-center p-8 pt-3 pb-0 md:px-24 md:text-left md:text-4xl md:leading-snug md:pb-3"
      >
        Ready to hack your product growth to PMF? Reach out to us!
      </p>
    </div>

    <div class="bg-slate-200 md:px-24 md:py-24 md:w-3/5">
      <form
        class="max-w-xs bg-slate-200 md:max-w-2xl pl-14 pb-3 md:pl-0 md:pb-0"
      >
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >
              First Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-300 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Jane"
            />
            <p class="text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              Last Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-300 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Email
            </label>
            <input
              class="appearance-none block w-full bg-gray-300 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              placeholder="janedoe@gmail.com"
            />
          </div>
        </div>

        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Your message
            </label>
            <input
              class="md:h-36 appearance-none block w-full bg-gray-300 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              placeholder="I would love to work with you!"
            />
          </div>
        </div>
        <div class="pl-10 pb-8 md:pl-0">
          <button
            class="bg-green-800 text-white py-2 px-7 rounded-3xl w-40 md:h-12"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="bg-slate-50">
    <div class="flex flex-row justify-between items-center md:p-4 p-6">
      <img src="../assets/logot.svg" class="md:w-52 md:ml-20" />

      <div>
        <p class="mr-12"><u>Privacy Policy</u></p>
      </div>
    </div>
  </div>
</template>
