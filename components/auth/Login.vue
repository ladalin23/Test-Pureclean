<template>
  <v-container fluid class="d-flex align-center justify-center">
    <!-- Background -->
    <img
      src="/images/Background/washing-machine-isolated.png"
      class="w-full h-full object-cover opacity-90 absolute top-0 z-0"
    />

    <v-row class="absolute inset-0 z-10">
      <v-col cols="12">
        <!-- Title -->
        <section class="px-6 mt-[157px]">
          <h1 class="text-[32px] font-bold text-[#2D5467]">
            Tired of Spending<br />Hours Doing Laundry?
          </h1>
        </section>

        <!-- Hidden Telegram widget -->
        <TelegramLogin ref="telegramRef" />

        <!-- Custom Sign In button -->
        <section class="absolute bottom-[47px] left-0 w-full px-6">
          <button
            class="w-full bg-[#3E6B7E] text-white py-4 rounded-full text-lg"
            @click="signInWithTelegram"
          >
            Sign In with Telegram
          </button>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import TelegramLogin from "~/components/auth/TelegramLogin.vue";

const telegramRef = ref(null);
const signInWithTelegram = () => {
  telegramRef.value?.triggerLogin();
};
</script>
