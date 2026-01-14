<div id="telegram-login"></div>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  window.onTelegramAuth = (user) => {
    console.log("Telegram user:", user);
  };

  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", "testpurecleanbot");
  script.setAttribute("data-size", "large");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  script.async = true;

  document.getElementById("telegram-login").appendChild(script);
});
</script>
