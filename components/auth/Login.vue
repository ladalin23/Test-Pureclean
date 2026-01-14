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

        <!-- Telegram Login Widget (hidden, will mount but not visible) -->
        <div id="telegram-login"></div>

        <!-- Custom Sign In Button -->
        <section class="absolute bottom-[47px] left-0 w-full px-6">
          <button
            class="w-full bg-[#3E6B7E] hover:bg-[#325868] text-white py-4
                    rounded-full text-lg font-medium transition-colors shadow-md"
            @click="loginWithTelegram"
          >
            Sign In
          </button>
        </section>
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
const router = useRouter();



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

window.onTelegramAuth = async (user) => {
  const username = user.username || `${user.first_name} ${user.last_name || ""}`;
  const telegram_id = String(user.id);
  const profile_picture = user.photo_url || "";

  console.log("Telegram user:", user);

  try {
    await userAuthStore.loginWithTelegram(user);
  } catch (error) {
    console.error("Login error:", error);
    await $swal.fire({
      title: 'Login or Signup failed',
      text: 'Oops, something went wrong. Please contact us!',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 2000
    });
  }
};

// Open the Telegram login page in a new tab as fallback
const loginWithTelegram = () => {
  // Wait for the Telegram widget iframe/button to be rendered
  const telegramButton = document.querySelector(".tgme_widget_login_button");

  if (telegramButton) {
    telegramButton.click(); // Simulate user click
  } else {
    console.warn("Telegram widget button not yet loaded.");
  }
};
</script>
