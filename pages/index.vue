<template>
  <v-app>
    <v-main class="bg-lighten-4 font-roboto" style="color: #323232 !important;">
      <v-container class="pa-6">
        <!-- Main Content -->
        <div v-if="Banners.length > 0 && News.length > 0 && loyaltyCard.length > 0">
          <header class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center w-[140px] sm:w-[140px] md:w-[240px]">
              <v-img 
                src="/logo/PurecleanLogo.png" 
                width="100%"
                contain
                class="flex-grow-0" />
            </div>
            <v-btn
                to="/notification"
                icon
                variant="text"
              >
                <v-icon size="24" class="md:!text-[36px] sm:!text-[24px]">mdi-bell</v-icon>
              </v-btn>
          </header>

          <div class="mb-4">
            <h2 class="font-medium text-[20px] md:text-[30px] xl:text-[30px]">{{translate("hello")}}, <span class="font-bold" style="text-transform: capitalize;">{{ currentUser?.username }}</span></h2>
            <p class="font-normal text-[16px] md:text-[26px] xl:text-[26px]" >{{ translate("welcome_to_pureclean_laundry") }}</p>
          </div>

          <v-card class="rounded-xl mb-8 overflow-hidden" elevation="0">
              <div class="h-[230px] sm:h-[23 0px] md:h-[390px] xl:h-[460px]">
                <v-carousel
                    height="100%"
                    hide-delimiter-background
                    :show-arrows="false"
                    cycle > 
                    <v-carousel-item
                        v-for="(image, i) in Banners"
                        :key="i"
                        :src="image.image_url"
                        cover
                    ></v-carousel-item>
                </v-carousel>
              </div>
          </v-card>

          <!-- Loyalty Card Header -->
          <div class="mb-8" >
            <div class="mb-4 px-1 d-flex justify-space-between align-center">
              <span class="font-medium text-[20px] md:text-[30px] xl:text-[30px] ">{{translate("loyaltycard")}}</span>
            </div>
            <CardsLoyaltyCard :loyaltyCard="loyaltyCard" />
          </div>

          <div class="mb-8" >
            <div class="w-full p-0">
              <!-- Header -->
              <div class="flex justify-between items-center px-1 mb-4">
                <h2 class="text-[20px] md:text-[30px] font-medium">{{translate("news")}} & {{translate("activity")}}</h2>
                <nuxt-link to="/news-activity" class="text-[14px] md:text-[24px] font-normal color-[#7F7F7F] no-underline" style="font">
                  {{translate("see_more")}}
                </nuxt-link>
              </div>
              <!-- Slider -->
              <div
                class="flex gap-[10px] overflow-x-auto px-1 snap-x snap-mandatory scrollbar-hide"
              >
                <div
                  v-for="(item, i) in News.slice(0, 3)"
                  :key="i"
                  class="flex-none w-[97%] snap-start"
                >
                  <div 
                      class="relative h-[300px] md:h-[400px] xl:h-[600px] rounded-xl overflow-hidden shadow-xl"
                      @click="goToDetail(item.global_id)">
                    <img
                      :src="item.image_url"
                      class="w-full h-full object-cover"
                      alt=""
                    />

                    <!-- Overlay -->
                    <div
                      class="absolute inset-0 flex flex-col justify-between p-6"
                      style="background: linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 40%, rgba(15,40,60,.85) 100%);"
                    >
                      <!-- Icon -->
                      <div>
                        <div
                          class="w-11 h-11 rounded-full flex items-center justify-center border border-white/40 backdrop-blur-sm bg-white/20"
                        >
                          <v-icon :icon="item.icon" color="white" size="22" />
                        </div>
                      </div>

                      <!-- Text + Button -->
                      <div class="flex justify-between items-end">
                        <div class="text-white pb-1">
                          <h3 class="text-xl font-bold leading-tight mb-1">
                            {{ item.title }}
                          </h3>
                          <p class="text-sm opacity-90 font-light">
                            {{ item.subtitle }}
                          </p>
                        </div>

                        <button
                          class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"
                        >
                          <v-icon icon="mdi-chevron-right" color="black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-8" >
            <!-- Section Header -->
            <div class="px-1 mb-4">
              <h2 class="text-[20px] md:text-[30px] font-medium">
                {{translate("need_help_with_laundry")}}?
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
          ></v-btn>
        </div>
        <!-- Loading Spinner -->
        <div v-else class="flex justify-center items-center h-[80vh]">
          <v-progress-circular indeterminate color="primary" size="70"></v-progress-circular>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { inject } from "vue";
  import Icon from '@/components/Icons.vue';
  import { useRouter } from 'vue-router'
  import { userAuth } from '~/store/userAuth';
  import { storeToRefs } from 'pinia'
  import { useBannerStore } from '~/store/banner'
  import { useNewsStore } from '~/store/news'
  import { useLoyaltyCardStore } from '~/store/loyalty_card'
  import { useNuxtApp } from '#app';

  const nuxtApp = useNuxtApp();
  const translate = nuxtApp.$translate as (key: string) => string;
  
  const auth = userAuth()
  const { user, isLoggedIn } = storeToRefs(auth)
  const currentUser = computed(() => user.value || null)

  const { $alert } = useNuxtApp();
  // store
  const bannerStore = useBannerStore()
  const newsStore = useNewsStore()
  const loyaltyCardStore = useLoyaltyCardStore()

  // state
  const Banners = computed(() => bannerStore.banners)
  const News = computed(() => newsStore.news)
  const loyaltyCard = computed(() => loyaltyCardStore.loyaltyCard)

  onMounted(async () => {
    try {
      await bannerStore.fetchBanners()
      await newsStore.fetchNews();
      await loyaltyCardStore.fetchLoyaltyCards();
      
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
            subtitle: "Enjoy 20% off all laundry services untill Sunday", 
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
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load banners'
      $alert.error(msg)
    }
  })

  const router = useRouter()
  const goToDetail = (id) => {
      router.push(`/news-activity/${id}`)
  }

</script>
