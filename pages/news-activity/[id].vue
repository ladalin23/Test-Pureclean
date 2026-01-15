<template>
  <v-app class="bg-[#FFFFFF] dark:bg-[#191919]">
    <v-app-bar flat color="transparent" class="px-6">
      <nuxt-link to="/news-activity" >
        <v-icon size="28" class="dark:text-[#FFFFFF]">mdi-chevron-left</v-icon>
      </nuxt-link>
      <v-toolbar-title class="text-[20px] dark:text-[#FFFFFF] font-medium ml-n4 ps-6">
        {{getLangText(News.title)}}
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4">
        <v-img
          :src="News.image_url"
          cover
          aspect-ratio="16/9"
          class="rounded-xl mb-6"
        ></v-img>

        <div class="text-body-1 text-[#323232] line-height-lg dark:text-[#FFFFFF] px-2 text-justify">
            <p
              v-for="(para, index) in getLangParagraphs(News.content)"
              :key="index"
              class="mb-4"
            >
              {{ para }}
            </p>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    import { useNewsStore } from '~/store/news'
    import { getLangText, getLangParagraphs } from '~/config/pageHelper'

    const route = useRoute()
    const id = route.params.id;
    const { $alert } = useNuxtApp();

    const newsStore = useNewsStore()

    const News = ref([])
    const isLoading = ref(true)
      
    onMounted(async () => {
      try {
        isLoading.value = true
        await newsStore.fetchNew(id);
        News.value = newsStore.singleNews || []
        if(News.value.length == 0) {
          const ids = Number(id)
          News.value = promoImages.find(promo => promo.id == ids) || {}
        }
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load news'
        $alert.error(msg)
      } finally {
        isLoading.value = false
      }
    })

    
    const promoImages = [
        {
            id: 1,
            title: 'Get 20% Off',
            image_url: '/images/NewsActive/Discount_notification.jpg',
            content: 'Experience top-notch cleaning with our state-of-the-art washing machines that ensure your clothes are treated with the utmost care and precision.',
            icon: 'mdi-tag'
        },
        {
            id: 2,
            title: 'Just a Few Hours',
            image_url: '/images/NewsActive/Clothes_express.jpg',
            content: 'Let our experts handle the folding of your clothes, ensuring they are neatly pressed and ready to wear, saving you time and effort.',
            icon: 'mdi-alarm'
        },
        {
            id: 3,
            title: 'Dry Cleaning',
            subtitle: 'Free pickup and delivery on orders over $20.',
            image_url: '/images/NewsActive/Iron_clothse.jpg',
            content: 'Our eco-friendly cleaning process uses sustainable products and methods to protect both your clothes and the environment.',
            icon: 'mdi-tshirt-crew'
        }
    ];


</script>