<!-- components/AuthLogin.vue -->
<template>
  <v-container fluid class="d-flex align-center justify-center">
    <!-- Background -->
    <img
      src="/images/Background/washing-machine-isolated.png"
      class="w-full h-full object-cover opacity-90 absolute top-0 z-0"
      alt=""
    /> 

    <v-row
      justify="center"
      class="w-full absolute top-0 z-10 h-full
        bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(241,245,247,0.2)_60%,rgba(230,235,238,0.1)_100%)]"
    >
      <v-col cols="12" class="relative">
        <!-- Header -->
        <section class="px-6 mt-[157px]">
          <h1 class="text-[32px] font-bold leading-tight text-[#2D5467] tracking-tight">
            Tired of Spending<br />
            Hours Doing Laundry?
          </h1>
        </section>


        <!-- Sign In Button -->
        <section class="w-full absolute bottom-[47px] left-0 flex items-center justify-center px-6">
          <div class="mx-auto">
            <TelegramLogin />
          </div>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue"; // ← required
import TelegramLogin from "~/components/auth/TelegramLogin.vue";

const showModal = ref(false); // reactive variable for modal
const route = useRoute();

const goHome = () => {
  window.location.href = route.query.next || "/";
};
</script>
