<template>
  <!-- Hidden Telegram widget -->
  <div ref="tgRoot" class="hidden"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { userAuth } from "~/store/userAuth";

const tgRoot = ref(null);
const botUsername = "testpurecleanbot";
const userAuthStore = userAuth();
const { $swal } = useNuxtApp();

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;
  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");

  tgRoot.value.appendChild(script);
});

// MUST be global
window.onTelegramAuth = async (user) => {
  try {
    await userAuthStore.loginWithTelegram(user);
  } catch (error) {
    await $swal.fire({
      title: "Login failed",
      text: "Something went wrong",
      icon: "error",
      timer: 2000,
    });
  }
};

// Expose click trigger
defineExpose({
  triggerLogin() {
    const iframe = tgRoot.value?.querySelector("iframe");
    if (iframe) {
      iframe.click(); // ✅ only allowed action
    }
  },
});
</script>
