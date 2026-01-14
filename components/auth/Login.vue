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

        <!-- Telegram Login Widget (default button) -->
        <div class="d-flex justify-center my-6">
          <div id="telegram-login"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { userAuth } from "~/store/userAuth";

const botUsername = "testpurecleanbot";
const userAuthStore = userAuth();
const {$swal} = useNuxtApp();

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  document.getElementById("telegram-login").appendChild(script);
});

// This function runs when user logs in via Telegram
window.onTelegramAuth = async (user) => {
  try {
    await userAuthStore.loginWithTelegram(user);
  } catch (error) {
    console.error("Login error:", error);
    await $swal.fire({
      title: "Login failed",
      text: "Something went wrong. Please try again!",
      icon: "error",
      confirmButtonText: "OK",
      timer: 2000
    });
  }
};
</script>
