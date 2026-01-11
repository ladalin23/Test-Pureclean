<template>
  <v-app-bar app flat height="64" :elevation="2">
    <v-container fluid class="d-flex align-center px-4 px-md-16">
      <!-- Logo -->
      <img
          src="/logo/OneDash-Rec-White.jpeg"
          :style="{ height: smAndDown ? '40px' : '50px' }"
          alt="OneDash logo"
          class="mr-2 mr-md-4 cursor-pointer"
          @click="handleNavigation('/')"
      />

      <!-- ✨ Desktop Nav Links (Refactored with v-for) -->
      <div class="d-none d-md-flex">
        <v-hover v-for="link in navLinks" :key="link.path" v-slot="{ isHovering, props }">
          <v-btn
              v-bind="props"
              :color="isActive(link.path) ? 'primary' : isHovering ? 'primary' : ''"
              variant="text"
              style="text-transform: none; font-size: large;"
              @click="handleNavigation(link.path)" 
          >
            {{ link.text }}
          </v-btn>
        </v-hover>
      </div>

      <v-spacer/>

      <!-- Auth buttons -->
      <div v-if="!isLoggedIn">
        <v-btn class="mr-2" variant="outlined" @click="handleNavigation('/auth')">
          Login
        </v-btn>
      </div>


      <!-- User Profile Menu -->
      <v-menu v-if="isLoggedIn && !smAndDown" transition="scale-transition" offset-y>
        <template #activator="{ props }">
          <v-avatar v-bind="props" class="cursor-pointer" size="40">
            <v-img src="/female_profile.jpg" alt="Profile" contain class="rounded-full"/>
          </v-avatar>
        </template>

        <v-list>
          <v-list-item>
            <v-btn color="primary" @click="logout()">Sign Out</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Mobile Avatar -->
      <v-avatar v-if="isLoggedIn && smAndDown" class="cursor-pointer" size="40">
        <v-img src="/female_profile.jpg" alt="Profile" contain class="rounded-full"/>
      </v-avatar>

      <!-- Mobile Menu Icon -->
      <v-app-bar-nav-icon class="d-md-none ml-2" @click="drawer = !drawer"/>
    </v-container>
  </v-app-bar>

  <!-- ✨ Mobile Drawer (Refactored with v-for) -->
  <v-navigation-drawer v-model="drawer" location="right" temporary class="d-md-none">
    <v-list>
      <v-list-item v-for="link in navLinks" :key="link.path" @click="navigateAndClose(link.path)">
        <v-list-item-title>{{ link.text }}</v-list-item-title>
      </v-list-item>
      
      <v-divider class="my-4" :thickness="2"></v-divider>

      <v-list-item v-if="isLoggedIn">
        <v-btn block color="primary" @click="logout()">Sign Out</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from '#imports';
import { useDisplay } from "vuetify";
import { userAuth } from "~/store/userAuth";

const userAuthStore = userAuth();
const router = useRouter();
const route = useRoute();
const { smAndDown } = useDisplay();
const drawer = ref(false);

// ✅ Create a single source of truth for navigation links
const navLinks = ref([
  { text: 'Home', path: '/' },
  { text: 'Pricing', path: '/pricing' },
  { text: 'About Us', path: '/about-us' },
  { text: 'Partnership', path: '/partnership' },
  { text: 'Contact Us', path: '/#contact-us' },
]);

const isLoggedIn = computed(() => userAuthStore.isLoggedIn);
const user = computed(() => userAuthStore.user);

onMounted(() => {
  userAuthStore.initializeSession();
});

// ✅ Improved logout function for better SPA experience
const logout = async () => {
  await userAuthStore.logout();
  // No need to reload the page, the reactivity will handle the UI update.
  await router.push('/');
}

const isActive = (path) => route.path === path;

// ✅ --- THE SMART NAVIGATION FUNCTION ---
// This one function handles all navigation logic as requested.
const handleNavigation = (path) => {
  // Check if we are already on the page we want to navigate to.
  if (isActive(path)) {
    // If yes, just scroll to the top of the page smoothly.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    // If it's a different page, perform the navigation.
    router.push(path).then(() => {
      // Wait for navigation, then scroll smoothly to top
      window.scrollTo({
      top: 0,
      behavior: 'smooth',
      });
    });
  }
};

const navigateAndClose = (path) => {
  drawer.value = false;
  handleNavigation(path); // Re-use the smart function
};
</script>