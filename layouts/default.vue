<template>
  <v-app>
    <v-main class="m-0" style="background-color: white;">
      <transition name="fade" mode="out-in">
        <div :key="$route.fullPath" class="">
          <slot />
        </div>
      </transition>
    </v-main>
    
    <button v-if="!hideFooter" class="fixed bottom-[116px]  right-[22px] z-10 flex items-center p-4 justify-center rounded-full shadow-md bg-[#35667D]" >
      <v-icon icon="mdi-email" size="24px" color="white" />
    </button>

    <Footer v-if="!hideFooter" />
  </v-app>
</template>
<script setup lang="ts">
import Footer from '~/components/Footer.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const hideFooter = computed(
  () => route.path.startsWith('/auth') || 
        route.path.startsWith('/locations') || 
        route.path === '/news-activity' || 
        route.path === '/order');

</script>