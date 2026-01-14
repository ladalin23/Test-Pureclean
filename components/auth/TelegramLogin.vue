<!-- components/TelegramLogin.vue -->
<template>
  <div id="telegram-login"></div>
</template>

<script setup>
import { onMounted } from 'vue'

const botUsername = 'testpurecleanbot'
const authUrl = 'https://test-pureclean.vercel.app'

onMounted(() => {
  if (document.getElementById('telegram-widget')) return

  const script = document.createElement('script')
  script.id = 'telegram-widget'
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true

  script.setAttribute('data-telegram-login', botUsername)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-auth-url', authUrl)
  script.setAttribute('data-request-access', 'write')

  document.getElementById('telegram-login').appendChild(script)
})
</script>
