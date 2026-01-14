<template>
  <div id="telegram-login"></div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // Ensure runs only on client
  if (typeof window === "undefined") return;

  // Telegram callback MUST be global
  window.onTelegramAuth = (user) => {
    console.log("Telegram user:", user);
    /*
      user = {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        auth_date,
        hash
      }
    */
  };

  const container = document.getElementById("telegram-login");
  if (!container) return;

  // Prevent duplicate buttons
  container.innerHTML = "";

  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;

  script.setAttribute("data-telegram-login", "purecleanv2bot");
  script.setAttribute("data-size", "large"); // small | medium | large
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");

  container.appendChild(script);
});
</script>
