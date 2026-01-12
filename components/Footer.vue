<template>
  <v-footer style="background-color: #f7f7f7;">
    <v-bottom-navigation
      v-model="activeNav"
      bg-color="white"
      color="primary"
      grow
      height="100"
      class="rounded-t-xl"
    >
      
      <v-btn value="/" :to="'/'">
        <v-icon>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>

      <v-btn value="/qr-code" :to="'/qr-code'">
        <v-icon>mdi-qrcode-scan</v-icon>
        <span>My QR</span>
      </v-btn>

      <v-btn value="/rewards" :to="'/rewards'">
        <v-icon>mdi-gift</v-icon>
        <span>Rewards</span>
      </v-btn>

      <v-btn value="/profile" :to="'/profile'">
        <v-icon>mdi-account</v-icon>
        <span >Profile</span>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>

<script setup>
  import { useRouter, useRoute } from '#imports'
  import { computed } from 'vue'

  const router = useRouter()
  const route = useRoute()

  // ✅ Active nav synced with current route (works on first load)
  const activeNav = computed({
    get: () => route.path,
    set: (val) => val
  })

  const handleNavigation = async (path) => {
    if (route.path === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      await router.push(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
</script>

<style scoped>

/* 1. Set the active color for the icon and text */
.rounded-t-xl :deep(.v-btn--active) {
  color: #3b667a !important;
  opacity: 1;
}

/* 2. Create the horizontal line for the active state */
.rounded-t-xl :deep(.v-btn--active > .v-btn__content::after) {
  content: "";
  position: absolute;
  bottom: 0px;
  left: -5px;
  right: -5px;
  height: 4px;
  background-color: #3b667a;
  border-radius: 2px;
}

/* 3. Ensure the button content container allows absolute positioning */
.rounded-t-xl :deep(.v-btn__content) {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
}

/* 4. Remove the default Vuetify background ripple/overlay circle */
.rounded-t-xl :deep(.v-btn__overlay) {
  display: none;
}
</style>
