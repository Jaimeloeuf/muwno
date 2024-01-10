<template>
  <div class="px-6 md:px-12 lg:px-16 xl:px-24">
    <div class="pb-8 xl:pb-12">
      <p
        class="pb-4 text-3xl font-extrabold text-zinc-600 md:text-4xl lg:text-5xl"
      >
        Start now for
        <span class="rounded-lg bg-yellow-300 px-2 text-zinc-700 shadow">
          FREE</span
        >
      </p>

      <div>
        <p class="pb-4 font-light sm:text-lg md:text-2xl">
          Simple, Honest pricing with no hidden fees.
          <br />
          You only pay for what you use over the free tier.
        </p>
      </div>

      <NuxtLink
        to="/pricing"
        class="font-semibold underline decoration-primary underline-offset-4 sm:text-xl"
      >
        Check out our Pricing
      </NuxtLink>
    </div>

    <CtaButton />
  </div>
</template>
