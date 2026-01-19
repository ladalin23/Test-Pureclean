<template>
  <v-app>
    <v-main class="bg-lighten-4 font-roboto" style="color: #323232 !important">
      <v-container class="pa-4">
        <!-- Header -->
        <header class="d-flex justify-between mb-7 py-1 align-center">
          <nuxt-link to="/">
            <v-icon size="28">mdi-chevron-left</v-icon>
          </nuxt-link>
          <p class="font-medium text-[20px] leading-[30px] tracking-normal">
            {{ translate("notifications") }}
          </p>
          <p></p>
        </header>

        <!-- Notifications Card -->
        <v-card variant="flat" max-width="500" class="mx-auto">
            <div v-if="notifications.length === 0" class="text-center py-4">
                No notifications
            </div>
            <div v-else>
                <v-list lines="two">
                    <v-list-item
                    v-for="item in notifications"
                    :key="item.id"
                    class="py-4"
                    >
                    <template v-slot:prepend>
                        <v-avatar color="orange-lighten-5" size="56" class="mr-4">
                        <v-icon icon="mdi-email-outline" color="orange-darken-1" size="24"></v-icon>
                        </v-avatar>
                    </template>

                    <v-list-item-title class="!text-sm !font-normal">
                    {{ item.title }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="!text-xs text-[#7F7F7F]">
                    {{ item.body }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                        <div class="align-self-start !text-xs text-[#7F7F7F] mt-1">
                        {{ dateFormat(item.created_at) }}
                        </div>
                    </template>
                    </v-list-item>
                </v-list>
            </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useNuxtApp } from '#app'
import { useNotificationStore } from '~/store/notification'

const nuxtApp = useNuxtApp()
const translate = nuxtApp.$translate as (key: string) => string
const notificationStore = useNotificationStore()
const notificationCard = ref<HTMLElement | null>(null)

// Format date nicely
function dateFormat(dateStr: string) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  return `${day} ${month}`
}
// Scroll to newest notification automatically
const scrollToBottom = async () => {
  await nextTick()
  if (notificationCard.value) {
    notificationCard.value.scrollTop = notificationCard.value.scrollHeight
  }
}

// Watch for new notifications
watch(
  () => notificationStore.notifications.length,
  () => {
    scrollToBottom()
    notificationStore.markAllAsRead()
  }
)

const notifications = computed(() => notificationStore.notifications);

onMounted(async () => {
  await notificationStore.initFCM()
  notificationStore.markAllAsRead()
})

</script>

