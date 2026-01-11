export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    // Watch for route changes
    nuxtApp.$router.afterEach((to, from) => {
      if (to.hash) {
        const targetElement = document.getElementById(to.hash.substring(1)); // Get the target element by hash
        if (targetElement) {
          // Scroll smoothly to the element
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
});