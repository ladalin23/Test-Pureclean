import { userAuth } from '~/store/userAuth'

export default defineNuxtPlugin(async () => {
  const auth = userAuth()
  // make sure this is SSR-safe (use cookies, not localStorage, on server)
  await auth.initializeSession?.()
})
