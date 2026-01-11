import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // If there's a hash, we handle it ourselves.
    if (to.hash) {
      // We return a Promise to take full control of the scrolling.
      return new Promise((resolve) => {
        // We use a timeout to wait for any other scripts/transitions
        // to finish before we execute our scroll command.
        // 100-300ms is usually a safe bet.
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 80 // Optional: Add an offset for a sticky header
          })
        }, 300) // Start with a slightly higher value
      })
    }

    // This handles back/forward browser buttons.
    if (savedPosition) {
      return savedPosition
    }

    // This scrolls to the top for all other page navigations.
    return { top: 0, behavior: 'smooth' }
  },
}