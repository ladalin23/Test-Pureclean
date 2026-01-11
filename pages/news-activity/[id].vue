<template>
  <v-app>
    <v-app-bar flat color="transparent" class="px-6">
      <nuxt-link to="/news-activity" >
        <v-icon size="28">mdi-chevron-left</v-icon>
      </nuxt-link>
      <v-toolbar-title class="text-[20px] font-medium ml-n4 ps-6">
        {{New.title}}
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4">
        <v-img
          :src="New.image_url"
          cover
          aspect-ratio="16/9"
          class="rounded-xl mb-6"
        ></v-img>

        <div class="text-body-1 text-grey-darken-3 line-height-lg px-2 text-justify">
          {{New.content}}
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
    
    import { useRoute } from 'vue-router'
    import { useNewsStore } from '~/store/news'

    definePageMeta({
        layout: 'blank'
    });

    const route = useRoute()
    const id = route.params.id;

    const { $alert } = useNuxtApp();

    const newsStore = useNewsStore()

    const New = ref([])
    const isLoading = ref(true)
      
    onMounted(async () => {
      try {
        isLoading.value = true
        await newsStore.fetchNew(id);
        New.value = newsStore.singleNews || []
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load news'
        $alert.error(msg)
      } finally {
        isLoading.value = false
      }
    })


</script>