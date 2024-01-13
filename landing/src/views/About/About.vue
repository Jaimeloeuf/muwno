<script setup lang="ts">
import Navbar from "../shared/Navbar.vue";
import CtaButton from "../shared/CtaButton.vue";
import Footer from "../shared/Footer.vue";
</script>

<template>
  <Navbar />

  <div
    class="flex h-[90vh] w-full flex-col items-center justify-center bg-[url(../assets/about_hero.jpg)] bg-cover bg-left"
  >
    <p
      class="max-w-screen-xl pb-20 text-center text-3xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
    >
      Creating the future of<br />
      Customer Feedback
    </p>
  </div>

  <div class="flex w-full flex-col items-center p-8 xl:py-12">
    <div class="max-w-screen-md">
      <div class="pb-12">
        <p class="pb-8 text-5xl font-thin text-primary">About us</p>

        <p class="pb-4 text-xl font-light xl:text-2xl">
          <img src="../../assets/logo.svg" class="inline-block h-6 px-1 pb-1" />
          helps businesses and products like your succeed by improving the
          Customer Feedback loop. Here's how:
        </p>

        <ol class="list-decimal space-y-2 px-5 font-light xl:text-xl">
          <li>
            To make money, you need a product or service that people want to pay
            for.
          </li>
          <li>
            To make something people want to pay for, you have to understand
            what they need, want and care about.
          </li>
          <li>
            muwno helps you to deeply understand your customers and what they
            will pay for.
          </li>
          <li>
            We do this by automating customer feedback collection and analysis
            to give you actionable insights.
          </li>
          <li>
            So that you can understand what your customers want and create
            something they will pay for, thereby making you more money.
          </li>
        </ol>
      </div>

      <div class="pb-12">
        <p
          class="pb-4 text-3xl font-medium text-zinc-800 underline decoration-zinc-300 decoration-1 underline-offset-4"
        >
          Our mission
        </p>
        <p class="pb-4 font-light xl:text-xl">
          Our mission is to help businesses and products like yours understand
          your customers needs and wants better, so that you can
        </p>
        <ol class="list-decimal space-y-3 px-5 text-lg font-light xl:text-xl">
          <li>
            <span class="font-semibold text-primary">Reduce churn.</span>
          </li>
          <li>
            <span class="font-semibold text-primary"
              >Unlock more customers</span
            >
            like your existing happy customers by targeting them better once you
            understand what existing happy customers value.
          </li>
          <li>
            <span class="font-semibold text-primary">
              Predict and forecast what to do next
            </span>
            by understanding whats important to your most valuable group of
            customers.
          </li>
        </ol>
      </div>

      <div class="pb-12">
        <p
          class="pb-4 text-3xl font-medium text-zinc-800 underline decoration-zinc-300 decoration-1 underline-offset-4"
        >
          Why did we build muwno?
        </p>
        <div class="pb-4 font-light xl:text-xl">
          <p class="pb-4">
            Our last startup failed despite 9 months of hard work due to a lack
            of Product Market Fit as we didn't understand what our customers
            truly wanted since we spent most of the time just building the
            product based on what we thought customers would want.
          </p>
          <p class="pb-4">
            Even though we knew it was important for us to understand our
            potential customers and users, we always pushed it off because it is
            hard and tedious manual work to do it right consistently. We
            procrastinated for someday when the product became more stable and
            ended up just doing what 'sounds right in our heads'.
          </p>
          <p class="pb-4">
            When we finally launched the product and started talking to people,
            we found out that nobody actually wanted, needed, or even cared
            about our product. So after months of work and zero traction, we had
            to shut it down
            <span class="font-extralight">(surprise, surprise!)</span>.
          </p>
          <p class="pb-4">
            After shutting down our last startup and working for a few years, we
            came back to the drawing board to build a new product. This time,
            keeping the lesson close to heart about always putting our customers
            needs and wants first and foremost.
          </p>
          <p class="pb-4">
            We looked around and found that after all these years, it was still
            hard to do Customer Feedback right and even harder to do it right
            consistently. Most existing products out there, despite being better
            than the free Google Form, are still hard and tedious to use,
            requiring lots of manual work from product managers, customer
            support staff, and even engineering for simple integrations.
          </p>
          <p>
            Seeing this gap in easy to use and effective Customer Feedback
            tools, we made it our mission to improve Customer Feedback
            collection and analysis to help businesses and products just like
            yours to succeed!
          </p>
        </div>
      </div>

      <div class="pb-12 xl:pb-20">
        <p
          class="pb-4 text-3xl font-medium text-zinc-800 underline decoration-zinc-300 decoration-1 underline-offset-4"
        >
          Our team
        </p>

        <p class="pb-4 font-light xl:text-xl">
          After spending years working across startups, SMEs, scale ups and
          government, we are now using the lessons we learned to build the
          future of Customer Feedback for you!
        </p>

        <div
          class="flex flex-col justify-between gap-8 sm:flex-row sm:gap-4 xl:gap-12"
        >
          <div class="w-full">
            <img src="../../assets/profile/YJ.jpg" class="pb-2" />
            <p class="text-3xl font-bold text-primary">Yan Jun</p>
            <p class="pb-4 text-xl font-semibold text-primary">
              Co-Founder, Product
            </p>
            <p class="text-lg">
              <a href="tel:+65 9725 8640">
                <span class="pr-4 text-xl font-bold">T.</span>
                <span class="hover:underline">+65 9725 8640</span>
              </a>
            </p>
            <p class="pb-1 text-lg">
              <a href="mailto:yanjun@muwno.com">
                <span class="pr-4 text-xl font-bold">E.</span>
                <span class="hover:underline">yanjun@muwno.com</span>
              </a>
            </p>
            <p class="text-lg">
              <a
                href="https://linkedin.com/in/quek-yan-jun"
                target="_blank"
                class="flex flex-row items-baseline"
              >
                <img
                  src="../../assets/social-icons/li.svg"
                  class="inline-block h-4 pr-5"
                />
                <span class="hover:underline">
                  linkedin.com/in/quek-yan-jun
                </span>
              </a>
            </p>

            <div class="pr-2 pt-8 text-right text-lg">
              <p>"I got this!"</p>
              <p>- YJ</p>
            </div>
          </div>

          <div class="w-full">
            <img src="../../assets/profile/JJ.jpg" class="pb-2" />
            <p class="text-3xl font-bold text-primary">JJ</p>
            <p class="pb-4 text-xl font-semibold text-primary">
              Co-Founder, Engineer
            </p>
            <p class="text-lg">
              <a href="tel:+65 9426 3687">
                <span class="pr-4 text-xl font-bold">T.</span>
                <span class="hover:underline">+65 9426 3687</span>
              </a>
            </p>
            <p class="pb-1 text-lg">
              <a href="mailto:yanjun@muwno.com">
                <span class="pr-4 text-xl font-bold">E.</span>
                <span class="hover:underline">JJ@muwno.com</span>
              </a>
            </p>
            <p class="text-lg">
              <a
                href="https://linkedin.com/in/jaimeloeuf"
                target="_blank"
                class="flex flex-row items-baseline"
              >
                <img
                  src="../../assets/social-icons/li.svg"
                  class="inline-block h-4 pr-5"
                />
                <span class="hover:underline">
                  linkedin.com/in/jaimeloeuf
                </span>
              </a>
            </p>

            <div class="pr-2 pt-8 text-right text-lg">
              <p>"You got this!"</p>
              <p>- JJ</p>
            </div>
          </div>
        </div>
      </div>

      <CtaButton />
    </div>
  </div>

  <Footer></Footer>
</template>
