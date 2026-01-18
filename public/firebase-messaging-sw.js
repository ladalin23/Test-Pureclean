importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyCFXe7ufnjzKFKOU74xssD22VBu6H1ZnuA",
  authDomain: "pureclean-launtromat.firebaseapp.com",
  projectId: "pureclean-launtromat",
  storageBucket: "pureclean-launtromat.firebasestorage.app",
  messagingSenderId: "514438040302",
  appId: "1:514438040302:web:e8915681f414f9318241ff",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  })
})
