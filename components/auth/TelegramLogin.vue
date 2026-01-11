<template>
  <client-only>
    <div class="d-flex justify-center">
      <div id="telegram-login"></div>
    </div>
  </client-only>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { userAuth } from "~/store/userAuth";

// Pinia store
const authStore = userAuth();

// Get public runtime config (bot username)
const config = useRuntimeConfig();
const botUsername = config.public.telegramBotUsername || "testpurecleanbot";

/**
 * Telegram callback
 * This function MUST be global
 */
function onTelegramAuth(user) {
  if (!user || !user.id) return;

  console.log("Telegram user:", user);

  authStore.loginWithTelegram(user).catch(() => {
    // Use sweetalert or simple alert
    $swal.fire({
      title: "Login failed",
      text: "Telegram authentication error",
      icon: "error",
      timer: 2000,
    });
  });
}

onMounted(() => {
  // Only run on client-side
  if (!process.client) return;

  // Make sure the callback is global before script loads
  window.onTelegramAuth = onTelegramAuth;

  const container = document.getElementById("telegram-login");
  if (!container || container.children.length > 0) return;

  // Inject Telegram widget script
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;

  script.setAttribute("data-telegram-login", botUsername); // must match exactly
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-request-access", "write");
  script.setAttribute("data-onauth", "onTelegramAuth"); // global function

  container.appendChild(script);
});

onBeforeUnmount(() => {
  const el = document.getElementById("telegram-login");
  if (el) el.innerHTML = "";
});
</script>

<style scoped>
/* Optional styling */
#telegram-login {
  margin-top: 1rem;
}
</style>
