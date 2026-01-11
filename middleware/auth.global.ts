import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { userAuth } from '~/store/userAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = userAuth()

  // allow truly public pages if you want
  if ((to.meta as any)?.public) return

  // plugin already did initializeSession, but this is safe to call again
  await auth.initializeSession?.()

  const hasToken = !!auth.getToken?.()
  const isValid  = hasToken ? await auth.checkTokenExpired?.() : false

  if (!isValid && to.path !== '/auth') {
    return navigateTo({ path: '/auth', query: { next: to.fullPath } })
  }
  if (isValid && to.path === '/auth') {
    const next = typeof to.query.next === 'string' ? to.query.next : '/'
    return navigateTo(next)
  }
})
