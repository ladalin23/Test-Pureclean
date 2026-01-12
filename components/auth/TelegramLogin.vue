<template>
  <div id="telegram-login-wrapper">
    <div id="telegram-login"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { userAuth } from "~/store/userAuth"

const botUsername = "testpurecleanbot"
const userAuthStore = userAuth()
const { $swal } = useNuxtApp()

onMounted(() => {
  const script = document.createElement("script")
  script.src = "https://telegram.org/js/telegram-widget.js?22"
  script.async = true
  script.setAttribute("data-telegram-login", botUsername)
  script.setAttribute("data-size", "large")
  script.setAttribute("data-radius", "20")
  script.setAttribute("data-onauth", "onTelegramAuth(user)")
  script.setAttribute("data-request-access", "write")

  document.getElementById("telegram-login").appendChild(script)
})

window.onTelegramAuth = async (user) => {
  try {
    await userAuthStore.loginWithTelegram(user)
  } catch (error) {
    console.error(error)
    await $swal.fire({
      title: "Login failed",
      text: "Something went wrong. Please try again.",
      icon: "error",
      timer: 2000,
    })
  }
}
</script>
