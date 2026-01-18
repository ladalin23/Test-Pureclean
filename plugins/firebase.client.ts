import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

export const useNotificationStore = defineStore('notifications', () => {
  const { $AdminPrivateAxios: api } = useNuxtApp() as any

  // State
  const notifications = ref([]) // store notifications from FCM or API
  const loading = ref(false)
  const error = ref(null)

  // Initialize Firebase messaging
  const initFCM = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyAwxJvERe9Z3hIeWMxqcyKKXr98aEU1ngI",
      authDomain: "test-notification-6b8fc.firebaseapp.com",
      projectId: "test-notification-6b8fc",
      storageBucket: "test-notification-6b8fc.appspot.com",
      messagingSenderId: "832683863762",
      appId: "1:832683863762:web:9049dd623d20a05733070b",
      measurementId: "G-CKT8HZQLY0",
    }

    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission denied')
      return
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: '<BFdbgMGQgLGsHA2owDJmJsWLyvduXVzVktJGVeXFYVkVlw8GKYutfPTJJiSOsCsaS29fAwLRmVAWaTHK_nboGSc>', // replace with your Web Push VAPID key
      })
      if (token) {
        console.log('FCM Token:', token);
        // Register token in Laravel
        await api.post('/fcm/register', { token, platform: 'web' })
      }
    } catch (err) {
      console.error('Error getting FCM token:', err)
    }

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log('FCM Message received:', payload)
      if (payload.notification) {
        notifications.value.unshift({
          id: new Date().getTime(),
          title: payload.notification.title,
          body: payload.notification.body,
          created_at: new Date().toISOString(),
        })
      }
    })
  }

  // Fetch notifications from backend API
  const fetchNotifications = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/notifications')
      notifications.value = res.data
    } catch (err) {
      console.error('Error fetching notifications:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    loading,
    error,
    initFCM,
    fetchNotifications,
  }
})
