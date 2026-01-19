import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export const useNotificationStore = defineStore('notification', () => {
  const { $AdminPrivateAxios: api } = useNuxtApp()

  const notifications = ref([])
  const error = ref(null)

  /* -------------------------
     LOCAL STORAGE HELPERS
  --------------------------*/
  const STORAGE_KEY = 'user_notifications'

  const loadNotifications = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      notifications.value = JSON.parse(saved)
    }
  }

  const saveNotifications = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value))
  }

  /* -------------------------
    UNREAD COUNT (IMPORTANT)
  --------------------------*/
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.is_read).length
  )

  /* -------------------------
     ADD NOTIFICATION
  --------------------------*/
  const addNotification = (notification) => {
    notifications.value.unshift({
      id: notification.id || Date.now(),
      title: notification.title || '',
      body: notification.body || '',
      created_at: notification.created_at || new Date().toISOString(),
      is_read: false,
    })

    saveNotifications()
  }

  /* -------------------------
     INIT FCM (AFTER LOGIN)
  --------------------------*/
  const initFCM = async () => {
    loadNotifications() // 👈 LOAD OLD MESSAGES FIRST

    const firebaseConfig = {
      apiKey: "AIzaSyCFXe7ufnjzKFKOU74xssD22VBu6H1ZnuA",
      authDomain: "pureclean-launtromat.firebaseapp.com",
      projectId: "pureclean-launtromat",
      storageBucket: "pureclean-launtromat.firebasestorage.app",
      messagingSenderId: "514438040302",
      appId: "1:514438040302:web:e8915681f414f9318241ff",
    }

    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    try {
      const token = await getToken(messaging, {
        vapidKey: 'BEe_pLIsLzYqfL6dUqn98cI14aTs8iJs0RQXL_l8mE4etQP55_ja7Y7iT8NXHq9-71jq5hIhUbbpEmY1UWRpsxs',
      })

      if (token) {
        console.log(token)
        await api.post('/fcm/register', { token, platform: 'web' })
      }
    } catch (err) {
      error.value = err
    }

    /* -------------------------
       LISTEN FOR NEW PUSH
    --------------------------*/
    onMessage(messaging, (payload) => {
      if (payload.notification) {
        addNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        })
      }
    })
  }

  
  /* -------------------------
     MARK ALL AS READ
  --------------------------*/
  const markAllAsRead = () => {
    notifications.value = notifications.value.map(n => ({
      ...n,
      is_read: true,
    }))

    saveNotifications()
  }

  /* -------------------------
     CLEAR (LOGOUT)
  --------------------------*/
  const clearNotifications = () => {
    notifications.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    notifications,
    error,
    unreadCount,
    initFCM,
    addNotification,
    loadNotifications,
    clearNotifications,
    markAllAsRead,
  }
})
