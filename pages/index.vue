<template>
  <v-app>
    <v-main class="font-roboto bg-[#FFFFFF] dark:bg-[#191919]" style="color: #323232 !important;">
      <v-container class="pa-6">
        
        <div v-if="Banners.length > 0 && News.length > 0 && loyaltyCard.length > 0">
          
          <header class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center w-[140px] sm:w-[140px] md:w-[240px]">
              <v-img 
                :src="isDark ? '/logo/DarkPurecleanLogo.png' : '/logo/PurecleanLogo.png'" 
                width="100%"
                contain
                class="flex-grow-0" 
              />
            </div>
            <v-btn to="/notification" icon variant="text">
              <v-badge  
                dot 
                color="green" 
                offset-x="3" 
                offset-y="3" 
                :model-value="newnotificatoin > 0" >
                <v-icon size="24" class="md:!text-[36px] sm:!text-[24px] dark:text-[#FFFFFF]">
                  mdi-bell
                </v-icon>
              </v-badge>
            </v-btn>
          </header>

          <div class="mb-4">
            <h2 class="font-medium text-[20px] md:text-[30px] xl:text-[30px] dark:text-[#FFFFFF]">
              {{ translate("hello") }}, 
              <span class="font-bold capitalize">{{ currentUser?.username }}</span>
            </h2>
            <p class="font-normal text-[16px] md:text-[26px] xl:text-[26px] dark:text-[#FFFFFF]">
              {{ translate("welcome_to_pureclean_laundry") }}
            </p>
          </div>

          <v-card class="rounded-xl mb-8 overflow-hidden" elevation="0">
            <div class="h-[230px] sm:h-[230px] md:h-[390px] xl:h-[460px]">
              <v-carousel
                height="100%"
                hide-delimiter-background
                :show-arrows="false"
                cycle
              > 
                <v-carousel-item
                  v-for="(image, i) in Banners"
                  :key="i"
                  :src="image.image_url"
                  cover
                />
              </v-carousel>
            </div>
          </v-card>

          <div class="mb-8">
            <div class="mb-4 px-1 d-flex justify-space-between align-center">
              <span class="font-medium text-[20px] md:text-[30px] xl:text-[30px] dark:text-[#FFFFFF]">
                {{ translate("loyaltycard") }}
              </span>
            </div>
            <CardsLoyaltyCard :loyaltyCard="loyaltyCard" />
          </div>

          <div class="mb-8">
            <div class="w-full p-0">
              <div class="flex justify-between items-center px-1 mb-4">
                <h2 class="text-[20px] md:text-[30px] font-medium dark:text-[#FFFFFF]">
                  {{ translate("news") }} & {{ translate("activity") }}
                </h2>
                <nuxt-link to="/news-activity" class="text-[14px] md:text-[24px] font-normal text-[#7F7F7F] dark:text-[#FFFFFF]">
                  {{ translate("see_more") }}
                </nuxt-link>
              </div>

              <div class="flex gap-[10px] overflow-x-auto px-1 snap-x snap-mandatory scrollbar-hide">
                <div
                  v-for="(item, i) in News.slice(0, 3)"
                  :key="i"
                  class="flex-none w-[97%] snap-start"
                >
                  <div 
                    class="relative h-[300px] md:h-[400px] xl:h-[600px] rounded-xl overflow-hidden shadow-xl cursor-pointer"
                    @click="goToDetail(item.global_id)"
                  >
                    <img :src="item.image_url" class="w-full h-full object-cover" alt="news image" />

                    <div
                      class="absolute inset-0 flex flex-col justify-between p-6"
                      style="background: linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 40%, rgba(15,40,60,.85) 100%);"
                    >
                      <div>
                        <div class="!w-[40px] !h-[40px] rounded-full flex items-center justify-center border border-white/40 backdrop-blur-sm bg-white/20">
                          <v-icon :icon="item.icon" color="white" size="22" />
                        </div>
                      </div>

                      <div class="flex justify-between items-end">
                        <div class="w-[87%] text-white pb-1">
                          <h3 class="text-xl font-bold leading-tight mb-1">{{ getLangText(item.title) }}</h3>
                          <p class="text-sm opacity-90 font-light">{{ item.subtitle }}</p>
                        </div>
                        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
                          <v-icon icon="mdi-chevron-right" color="black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <div class="px-1 mb-4">
              <h2 class="text-[20px] md:text-[30px] font-medium dark:text-[#FFFFFF]">
                {{ translate("need_help_with_laundry") }}?
              </h2>
            </div>
            <CardsNeedHelpCard />
          </div>

          <v-btn
            icon="mdi-email"
            color="blue-grey-darken-3"
            position="fixed"
            location="bottom right"
            class="ma-6"
            elevation="4"
          />
        </div>

        <div v-else class="flex justify-center items-center h-[80vh]">
          <v-progress-circular indeterminate color="primary" size="70" />
        </div>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNuxtApp } from '#app';

// Stores
import { userAuth } from '~/store/userAuth';
import { useBannerStore } from '~/store/banner'
import { useNewsStore } from '~/store/news'
import { useLoyaltyCardStore } from '~/store/loyalty_card'
import { getLangText } from '~/config/pageHelper'
import { useNotificationStore } from '~/store/notification'


// --- Init Services ---
const router = useRouter()
const nuxtApp = useNuxtApp();
const translate = nuxtApp.$translate as (key: string) => string;

const { $alert } = useNuxtApp();
const colorMode = useColorMode();

// --- Store Setup ---
const auth = userAuth()
const bannerStore = useBannerStore()
const newsStore = useNewsStore()
const loyaltyCardStore = useLoyaltyCardStore()
const notificationStore = useNotificationStore()

const { user } = storeToRefs(auth)

// --- Computed State ---
const currentUser = computed(() => user.value || null)
const Banners = computed(() => bannerStore.banners)
const News = computed(() => newsStore.news)
const loyaltyCard = computed(() => loyaltyCardStore.loyaltyCard)
const newnotificatoin = computed(() => notificationStore.unreadCount);

// --- Dark Mode ---
const isDark = computed({
    get: () => colorMode.value === 'dark', 
})

// --- Methods ---
const goToDetail = (id) => {
  router.push(`/news-activity/${id}`)
}

// --- Lifecycle ---
onMounted(async () => {
  try {
    // Fetch data in parallel
    await Promise.all([
      bannerStore.fetchBanners(),
      newsStore.fetchNews(),
      loyaltyCardStore.fetchLoyaltyCards(),
      notificationStore.initFCM()
    ]);


    // Fallback Mock Data if API is empty
    if (bannerStore.banners.length === 0) {
      bannerStore.banners = [
        { image_url: "/images/Banner/Washing_machine.jpg" },
        { image_url: "/images/Banner/Drying_clothes.jpg" },
        { image_url: "/images/Banner/Preparing_clothes.jpg" },
      ]
    }

    if (newsStore.news.length === 0) {
      newsStore.news = [
        { 
          title: "Get 20% Off", 
          subtitle: "Enjoy 20% off all laundry services until Sunday", 
          image_url: "/images/NewsActive/Discount_notification.jpg", 
          icon: "mdi-tag",
          global_id: 2 
        },
        { 
          title: "Just a Few Hours", 
          subtitle: "Clothes cleaned in 2 hours. Limited slots daily", 
          image_url: "/images/NewsActive/Clothes_express.jpg", 
          icon: "mdi-alarm",
          global_id: 1 
        },
        { 
          title: "Dry Cleaning", 
          subtitle: "Professional care for delicate fabrics and suits.", 
          image_url: "/images/NewsActive/Iron_clothse.jpg", 
          icon: "mdi-tshirt-crew",
          global_id: 3 
        },
      ]
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || 'Failed to load content'
    $alert.error(msg)
  }
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>