<template>
  <div class="d-flex justify-center mb-4">
    <div id="telegram-login"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { userAuth } from '~/store/userAuth'

const config = useRuntimeConfig()
const botUsername = config.public.telegramBotUsername // ✅ from .env
const userAuthStore = userAuth()

function handleTelegramAuth(user) {
  const username =
    user.username || `${user.first_name} ${user.last_name || ''}`
  const telegram_id = String(user.id)
  const profile_picture = user.photo_url || ''

  console.log('Telegram user:', user)

  userAuthStore
    .login(username, telegram_id, profile_picture)
    .then(() => {
      console.log('Login successful')
    })
    .catch(async (error) => {
      console.error('Login error:', error)
      await $swal.fire({
        title: 'Login failed',
        text: 'Oops, something went wrong. Please contact us!',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000,
      })
    })
}

onMounted(() => {
  // ✅ Expose globally (required by Telegram widget)
  window.onTelegramAuth = handleTelegramAuth

  const container = document.getElementById('telegram-login')
  if (!container || container.children.length > 0) return // ✅ avoid duplicate widget

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.setAttribute('data-telegram-login', botUsername)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-radius', '20')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-onauth', 'onTelegramAuth')

  container.appendChild(script)
})

onBeforeUnmount(() => {
  const el = document.getElementById('telegram-login')
  if (el) el.innerHTML = ''
})
</script>
