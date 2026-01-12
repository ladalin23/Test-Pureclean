<template>
  <v-main class="bg-lighten-4 font-roboto" style="color: #323232 !important;">
    <!-- Loading Spinner -->
    <v-container class="pa-0 fill-height align-start">
      <v-sheet
        color="#35667D"
        height="250"
        width="100%"
        class=" text-center rounded-b-xl"
      >
        <div class="p-3 mt-[53px] mb-[15px] ">
          <h2 class="font-medium text-[20px] leading-[30px] tracking-normal">{{ translate("rewards") }}</h2>
        </div>
        <div class="p-4">
          <CardsLoyaltyCard :loyaltyCard="loyaltyCard" />
        </div>
      </v-sheet>

      <v-container class=" mt-[120px] md:mt-96 pt-10">
        
        <h3 class="text-[20px] font-medium mb-4">{{translate("reward_history")}}</h3>
        
        <v-list bg-color="transparent">
          <v-list-item
            v-for="(item, index) in Rewards"
            :key="index"
            class="px-0 mb-4"
          >
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-3" size="56">
                      <Icon
                          name="stamp"
                          :width="26"
                          :height="26"
                          color="#7F7F7F" />
              </v-avatar>
            </template>

            <v-list-item-title class="text-[14px] font-medium">{{ item.product.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-[12px] font-medium color-[#7F7F7F]">
              {{ formatDateTime(item.created_at) }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-chip size="small" color="#FFEDD4" variant="flat">
                <span style="color: #FFB86A !important;" >{{translate("claimed")}}</span> 
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-container>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
    import Icon from '@/components/Icons.vue';
    import { useRewardStore } from '~/store/reward'
    import { useLoyaltyCardStore } from '~/store/loyalty_card'
    import { useNuxtApp } from '#app';
    
    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;

    const { $alert } = useNuxtApp();

    const rewardStore = useRewardStore()
    const loyaltyCardStore = useLoyaltyCardStore()

    const Rewards = computed(() => rewardStore.rewards)
    const loyaltyCard = computed(() => loyaltyCardStore.loyaltyCard)

    onMounted(async () => {
      try {
        await rewardStore.fetchRewards();
        
        await loyaltyCardStore.fetchLoyaltyCards();
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load news'
        $alert.error(msg)
      }
    })

    const formatDateTime = (date) => {
      const d = new Date(date)

      const datePart = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d)

      const timePart = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(d)

      return `${datePart} at ${timePart}`
    }
    


</script>
