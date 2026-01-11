<template>
  <v-dialog
    v-model="showLogoutModal"
    max-width="420"
    persistent
    content-class="!rounded-3xl !shadow-2xl"
    transition="scale-transition"
  >
    <v-card class="!rounded-3xl overflow-hidden relative border-none">
      
      <div 
        v-if="isProcessing" 
        class="absolute inset-0 z-20 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500"
      >
        <div class="relative flex items-center justify-center">
          <v-progress-circular
            indeterminate
            color="red-darken-1"
            size="80"
            width="4"
          />
          <v-icon 
            icon="mdi-lock-open-outline" 
            class="absolute animate-pulse" 
            color="red-darken-1"
          />
        </div>
        <p class="mt-4 text-gray-700 font-bold tracking-wide animate-bounce">
          {{ translate("processing") }}...
        </p>
      </div>

      <div :class="['p-8 text-center transition-all duration-500', isProcessing ? 'scale-90 opacity-0' : 'scale-100 opacity-100']">
        
        <div class="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
          <v-icon 
            icon="mdi-logout" 
            color="error" 
            size="40"
          ></v-icon>
        </div>

        <h3 class="text-2xl font-black text-gray-900 mb-3">
          {{ translate("logout_confirmation") }}
        </h3>
        
        <p class="text-gray-500 text-base leading-relaxed mb-10">
          {{ translate("are_you_sure_logout") }}
        </p>

        <div class="flex flex-col gap-3">
          <v-btn
            block
            flat
            height="56"
            color="error"
            class="!rounded-2xl !text-lg !font-bold !normal-case hover:!scale-[1.02] active:!scale-[0.98] transition-all !shadow-xl shadow-red-200"
            @click="handleLogout"
          >
            {{ translate("logout") }}
          </v-btn>

          <v-btn
            block
            variant="text"
            height="56"
            class="!rounded-2xl !text-gray-400 !font-bold !normal-case hover:!bg-gray-50 transition-colors"
            @click="showLogoutModal = false"
          >
            {{ translate("cancel") }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app';

    // Props/Model
    const showLogoutModal = defineModel();

    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;
    const isProcessing = ref(false);
    const emit = defineEmits(['confirm']);

    const handleLogout = async () => {
        isProcessing.value = true;

        try {
            // Wait for the parent logout logic to finish
            await emit('confirm');
            
            // Smooth transition delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showLogoutModal.value = false;
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };
</script>

<style scoped>
    /* Custom backdrop blur for the whole dialog overlay */
    :deep(.v-overlay__scrim) {
    background: rgba(15, 23, 42, 0.3) !important;
    backdrop-filter: blur(4px) !important;
    }
</style>