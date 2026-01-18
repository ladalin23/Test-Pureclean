importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyAwxJvERe9Z3hIeWMxqcyKKXr98aEU1ngI",
  authDomain: "test-notification-6b8fc.firebaseapp.com",
  projectId: "test-notification-6b8fc",
  storageBucket: "test-notification-6b8fc.firebasestorage.app",
  messagingSenderId: "832683863762",
  appId: "1:832683863762:web:9049dd623d20a05733070b",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  })
})
