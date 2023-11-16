<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import Hero from "./Hero.vue";
import Benefits from "./Benefits.vue";
import Example from "./Example.vue";
import How from "./How.vue";
import Demo from "./Demo.vue";
import ContactUsForm from "./ContactUsForm.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <Navbar />
  <Hero class="pb-24 md:pt-8 lg:pb-40" />
  <Benefits class="pb-24 lg:pb-40" />
  <Example class="pb-20 md:pb-24" />
  <How class="pb-6 md:pb-24" />
  <Demo class="pb-6 md:pb-24" />
  <ContactUsForm class="pb-24" />
  <Footer></Footer>
</template>
