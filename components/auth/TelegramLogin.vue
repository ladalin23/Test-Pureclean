<template>
  <div id="telegram-login"></div>
</template>

<script setup>
import {onMounted} from "vue";
import {userAuth} from "~/store/userAuth";

const botUsername = "testpurecleanbot"; // Telegram bot username
const userAuthStore = userAuth();
const {$swal} = useNuxtApp();
const router = useRouter(); // Nuxt composable
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", botUsername);
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "20");
  script.setAttribute("data-userpic", "false");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  document.getElementById("telegram-login").appendChild(script);
});

window.onTelegramAuth = async (user) => {
  const username = user.username || user.first_name + user.last_name; // Fallback to first name if username is not available
  const telegram_id = String(user.id); // Telegram user ID
  console.log("Telegram user:", user);
  const profile_picture = user.photo_url || "";
  console.log("Profile picture URL:", profile_picture);
  try {
    await userAuthStore.loginWithTelegram(user);
  } catch (error) {
    console.error("Login error:", error);
    await $swal.fire({
      title: 'Login or Signup failed',
      text: 'Opps have something wrong. Let contact us!',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 2000
    });
  }

};
</script>