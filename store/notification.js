// stores/notification.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export const useNotificationStore = defineStore('notification', () => {
  const { $AdminPrivateAxios: api } = useNuxtApp()

  const notifications = ref([]) // store incoming notifications
  const error = ref(null)

  const addNotification = (notification) => {
    notifications.value.unshift({
      id: notification.id || new Date().getTime(),
      title: notification.title || '',
      body: notification.body || '',
      created_at: notification.created_at || new Date().toISOString(),
    })
  }

  const initFCM = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyCFXe7ufnjzKFKOU74xssD22VBu6H1ZnuA",
      authDomain: "pureclean-launtromat.firebaseapp.com",
      projectId: "pureclean-launtromat",
      storageBucket: "pureclean-launtromat.firebasestorage.app",
      messagingSenderId: "514438040302",
      appId: "1:514438040302:web:e8915681f414f9318241ff",
      measurementId: "G-HQH1WJCWL1"
    }
    console.log(2)

    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission denied')
      return
    }
    console.log(3)

    try {
      const token = await getToken(messaging, {
        vapidKey: 'BEe_pLIsLzYqfL6dUqn98cI14aTs8iJs0RQXL_l8mE4etQP55_ja7Y7iT8NXHq9-71jq5hIhUbbpEmY1UWRpsxs',
      })
      if (token) {
        console.log('FCM Token:', token)
        await api.post('/fcm/register', { token, platform: 'web' })
      }
    } catch (err) {
      console.error('Error getting FCM token:', err)
      error.value = err
    }

    onMessage(messaging, (payload) => {
      if (payload.notification) {
        addNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        })
      }
    })
  }

  return {
    notifications,
    error,
    addNotification,
    initFCM,
  }
})
