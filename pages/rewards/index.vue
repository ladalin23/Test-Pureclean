<template>
  <v-main class="font-roboto" style="color: #323232 !important;">
    <v-container class="pa-0 fill-height align-start">
      
      <v-sheet
        :color="isDark ? '#323232' : '#35667D'"
        height="250"
        width="100%"
        class="text-center rounded-b-xl"
      >
        <div class="p-3 mt-[53px] mb-[15px]">
          <h2 class="font-medium text-[20px] leading-[30px] tracking-normal">
            {{ translate("rewards") }}
          </h2>
        </div>
        
        <div class="p-4">
          <CardsLoyaltyCard :loyaltyCard="loyaltyCard" />
        </div>
      </v-sheet>

      <v-container class="mt-[120px] md:mt-96 pt-10">
        <h3 class="text-[20px] dark:text-[#FFFFFF] font-medium mb-4">
          {{ translate("reward_history") }}
        </h3>
        
        <v-list bg-color="transparent">
          <v-list-item
            v-for="(item, index) in Rewards"
            :key="index"
            class="px-0 mb-4"
          >
            <template v-slot:prepend>
              <v-avatar :color="isDark ? '#323232' : '#F3F4F6'" size="56" class="p-3">
                <Icon
                  name="stamp"
                  :width="26"
                  :height="26"
                  :color="isDark ? '#FFFFFF' : '#7F7F7F'" 
                />
              </v-avatar>
            </template>

            <v-list-item-title class="text-[14px] dark:text-[#FFFFFF] font-medium">
              {{ item.product.name }}
            </v-list-item-title>
            
            <v-list-item-subtitle class="text-[12px] dark:text-[#FFFFFF] font-medium color-[#7F7F7F]">
              {{ formatDate(item.created_at) }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-chip 
                size="small" 
                :color="isDark ? '#323232' : '#FFEDD4'" 
                variant="flat"
              >
                <span class="text-[#FFB86A] dark:text-[#FFFFFF]">
                  {{ translate("claimed") }}
                </span> 
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-container>
    </v-container>

    <div v-if="loading" class="absolute top-0 left-0 w-full flex justify-center items-center bg-white h-[100vh]">
      <v-progress-circular 
        indeterminate 
        color="primary" 
        size="70" 
      />
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useColorMode } from '#imports'

// Components & Utilities
import Icon from '@/components/Icons.vue'
import { formatDate } from '~/config/pageHelper'

// Stores
import { useRewardStore } from '~/store/reward'
import { useLoyaltyCardStore } from '~/store/loyalty_card'

// --- Init Composables ---
const nuxtApp = useNuxtApp()
const translate = nuxtApp.$translate as (key: string) => string
const { $alert } = useNuxtApp()
const colorMode = useColorMode()

const rewardStore = useRewardStore()
const loyaltyCardStore = useLoyaltyCardStore()

// --- Computed State ---
const Rewards = computed(() => rewardStore.rewards)
const loyaltyCard = computed(() => loyaltyCardStore.loyaltyCard)

// --- Dark Mode ---
const isDark = computed({
    get: () => colorMode.value === 'dark', 
})

// --- Lifecycle ---
onMounted(async () => {
  try {
    // Run both fetches in parallel for better performance
    await Promise.all([
      rewardStore.fetchRewards(),
      loyaltyCardStore.fetchLoyaltyCards()
    ])
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || 'Failed to load data'
    $alert.error(msg)
  }
})

// Loading 
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 4000) // 4 seconds
})
</script>
