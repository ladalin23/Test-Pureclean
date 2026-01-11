<template>
  <NuxtLayout :class="`lang-${currentLang}`">
    <!-- <Transition name="page" mode="out-in"> -->
      <NuxtPage />
    <!-- </Transition> -->
  </NuxtLayout>
  <Analytics />
  <SpeedInsights />
</template>

<script setup>
import { computed } from 'vue'
import { useCookie } from '#app'
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const languageCookie = useCookie('lang', { default: () => 'en' })
const currentLang = computed(() => languageCookie.value)

</script>

<style>
/* Simple page transition */
.page-enter-active, .page-leave-active { transition: opacity .18s ease; }
.page-enter-from, .page-leave-to { opacity: 0; }


/* assets/css/swal.css */
.swal-popup { border-radius: 16px; padding-top: 28px; }
.swal-title { font-weight: 800; letter-spacing: 0.2px; }
.swal-html   { display: flex; justify-content: center; }
.swal-lines  { text-align: center; margin-top: 4px; }
.swal-line   { margin: 6px 0; line-height: 1.5; }
.swal-confirm { padding: 10px 22px; border-radius: 12px; }
.swal-toast { border-radius: 14px; }
.swal-zoom-in { animation: swal-zoom-in 140ms ease-out; }
.swal-zoom-out { animation: swal-zoom-out 120ms ease-in forwards; }
@keyframes swal-zoom-in { from { transform: scale(.96); opacity: 0 } to { transform: scale(1); opacity: 1 } }
@keyframes swal-zoom-out { from { transform: scale(1); opacity: 1 } to { transform: scale(.98); opacity: 0 } }

</style>
