<template>
  <!-- Telegram button will be injected here -->
  <div id="telegram-login"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "#imports";

const botUsername = "testpurecleanbot";
const router = useRouter();

/**
 * Telegram auth callback (must be global)
 */
window.onTelegramAuth = (user) => {
  alert(
    `Logged in as ${user.first_name} ${user.last_name ?? ""} (${user.id}${
      user.username ? ", @" + user.username : ""
    })`
  );

  // Example: redirect after login
  // router.push("/dashboard");

  // Example: send user data to backend
  // await $fetch("/api/auth/telegram", { method: "POST", body: user });
};

onMounted(() => {
  // Prevent duplicate script injection
  if (document.getElementById("telegram-widget")) return;

  const script = document.createElement("script");
  script.id = "telegram-widget";
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;

  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");

  document.getElementById("telegram-login").appendChild(script);
});
</script>
