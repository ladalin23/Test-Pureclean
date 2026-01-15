<template>
  <v-app>
    <v-main class="bg-[#FFFFFF] dark:bg-[#191919]">
      <v-container v-if="News" class="pa-4">
        <!-- Header -->
        <header
          class="d-flex justify-between mb-7 py-1 align-center"
        >
          <nuxt-link
            to="/"
            class="dark:text-[#FFFFFF]"
          >
            <v-icon size="28">
              mdi-chevron-left
            </v-icon>
          </nuxt-link>

          <p
            class="font-medium text-[20px] leading-[30px] tracking-normal
                   dark:text-[#FFFFFF]"
          >
            {{ translate("news") }} & {{ translate("activity") }}
          </p>

          <p></p>
        </header>

        <!-- Slider Wrapper -->
        <div class="w-full p-0">
          <div
            class="gap-[10px] overflow-x-auto px-1 snap-x snap-mandatory
                   scrollbar-hide"
          >
            <div
              v-for="(item, i) in News"
              :key="i"
              class="flex-none w-[97%] snap-start mb-6"
            >
              <div
                class="relative h-[300px] rounded-xl overflow-hidden shadow-xl"
                @click="goToDetail(item.global_id)"
              >
                <img
                  :src="item.image_url"
                  class="w-full h-full object-cover"
                  alt=""
                />

                <!-- Overlay -->
                <div
                  class="absolute inset-0 flex flex-col justify-between p-6"
                  style="
                    background: linear-gradient(
                      to bottom,
                      rgba(0,0,0,.15) 0%,
                      rgba(0,0,0,0) 40%,
                      rgba(15,40,60,.85) 100%
                    );
                  "
                >
                  <!-- Icon -->
                  <div>
                    <div
                      class="w-11 h-11 rounded-full flex items-center
                             justify-center border border-white/40
                             backdrop-blur-sm bg-white/20"
                    >
                      <v-icon
                        :icon="item.icon"
                        color="white"
                        size="22"
                      />
                    </div>
                  </div>

                  <!-- Text & Button -->
                  <div class="flex justify-between items-end">
                    <div class="w-[87%] text-white pb-1">
                      <h3
                        class="text-xl font-bold leading-tight mb-1"
                      >
                        {{ getLangText(item.title) }}
                      </h3>

                      <p
                        class="text-sm opacity-90 font-light"
                      >
                        {{ item.subtitle }}
                      </p>
                    </div>

                    <button
                      class="w-10 h-10 flex items-center justify-center
                             rounded-full bg-white shadow-md"
                    >
                      <v-icon
                        icon="mdi-chevron-right"
                        color="black"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-container>

      <!-- Loading -->
      <div
        v-else
        class="flex justify-center items-center h-[80vh]"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="70"
        />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useNewsStore } from '~/store/news'
import { useNuxtApp } from '#app'
import { getLangText } from '~/config/pageHelper'

const nuxtApp = useNuxtApp()
const translate = nuxtApp.$translate as (key: string) => string

const { $alert } = useNuxtApp()
const newsStore = useNewsStore()

const News = computed(() => newsStore.news)

onMounted(async () => {
  try {
    await newsStore.fetchNews()

    if (newsStore.news.length === 0) {
      newsStore.news = [
        {
          title: 'Get 20% Off',
          subtitle: 'Enjoy 20% off all laundry services untill Sunday',
          image_url: '/images/NewsActive/Discount_notification.jpg',
          icon: 'mdi-tag',
          global_id: 2
        },
        {
          title: 'Just a Few Hours',
          subtitle: 'Clothes cleaned in 2 hours. Limited slots daily',
          image_url: '/images/NewsActive/Clothes_express.jpg',
          icon: 'mdi-alarm',
          global_id: 1
        },
        {
          title: 'Dry Cleaning',
          subtitle: 'Professional care for delicate fabrics and suits.',
          image_url: '/images/NewsActive/Iron_clothse.jpg',
          icon: 'mdi-tshirt-crew',
          global_id: 3
        }
      ]
    }
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      'Failed to load news'

    $alert.error(msg)
  } finally {
    isLoading.value = false
  }
})

const router = useRouter()

const goToDetail = (id) => {
  router.push(`/news-activity/${id}`)
}
</script>
