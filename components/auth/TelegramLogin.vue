<template>
  <div class="d-flex justify-center">
    <div id="telegram-login"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { userAuth } from "~/store/userAuth";

const config = useRuntimeConfig();
const authStore = userAuth();

const botUsername = config.public.telegramBotUsername;

/**
 * Telegram callback
 */
function onTelegramAuth(user) {
  if (!user || !user.id) return;

  console.log("Telegram user:", user);

  authStore
    .loginWithTelegram(user)
    .catch(() => {
      $swal.fire({
        title: "Login failed",
        text: "Telegram authentication error",
        icon: "error",
        timer: 2000,
      });
    });
}

onMounted(() => {
  // Telegram requires global function
  window.onTelegramAuth = onTelegramAuth;

  const container = document.getElementById("telegram-login");
  if (!container || container.children.length > 0) return;

  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;

  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-request-access", "write");
  script.setAttribute("data-onauth", "onTelegramAuth");

  container.appendChild(script);
});

onBeforeUnmount(() => {
  const el = document.getElementById("telegram-login");
  if (el) el.innerHTML = "";
});
</script>
