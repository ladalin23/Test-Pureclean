<template>
  <v-footer class="bg-[#FFFFFF] dark:bg-[#191919]">
    <v-bottom-navigation
      v-model="activeNav"
      :bg-color="isDark ? '#323232' : '#FFFFFF'" 
      grow
      height="100"
      class="rounded-t-xl"
      :class="isDark ? 'dark-mode': 'light-mode' "
    >
      <v-btn value="/" :to="'/'">
        <v-icon>mdi-home</v-icon>
        <span>{{translate('home')}}</span>
      </v-btn>

      <v-btn value="/qr-code" :to="'/qr-code'">
        <v-icon>mdi-qrcode-scan</v-icon>
        <span>{{translate('my_qr')}}</span>
      </v-btn>

      <v-btn value="/rewards" :to="'/rewards'">
        <v-icon>mdi-gift</v-icon>
        <span>{{translate('rewards')}}</span>
      </v-btn>

      <v-btn value="/profile" :to="'/profile'">
        <v-icon>mdi-account</v-icon>
        <span>{{translate('my_profile')}}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>

<script setup lang="ts">
  import { useRouter, useRoute } from '#imports'
  import { computed } from 'vue'
  import { useNuxtApp } from '#app';
  
  const nuxtApp = useNuxtApp();
  const translate = nuxtApp.$translate as (key: string) => string;

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

  
  // --- Dark Mode ---
  const colorMode = useColorMode()
  const isDark = computed({
      get() {
          return colorMode.value === 'dark'
      },
      set(value) {
          colorMode.preference = value ? 'dark' : 'light'
          localStorage.setItem('dark', value ? 'true' : 'false')
      }
  })

  onMounted(() => {
      const saved = localStorage.getItem('dark')
      if (saved === 'true') {
          colorMode.preference = 'dark'
      } else {
          colorMode.preference = 'light'
      }
  })
</script>

<style scoped>


/* 2. Create the horizontal line for the active state */
.rounded-t-xl :deep(.v-btn--active > .v-btn__content::after) {
  content: "";
  position: absolute;
  bottom: 0px;
  left: -5px;
  right: -5px;
  height: 4px;
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

.light-mode :deep(.v-btn--active) {
  color: #3b667a !important;
  opacity: 1;
}

.light-mode :deep(.v-btn--active > .v-btn__content::after) {
  background-color: #3b667a;
}

.dark-mode :deep(.v-btn--active) {
  color: #FFFFFF !important;
  opacity: 1;
}

.dark-mode :deep(.v-btn--active > .v-btn__content::after) {
  background-color: #E6E6E6;
}
</style>
