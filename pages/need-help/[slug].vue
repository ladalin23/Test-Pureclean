<template>
  <v-app>
    <v-app-bar flat border="bottom" class="px-6">
      <nuxt-link to="/" >
        <v-icon color="grey-darken-4" size="28">mdi-chevron-left</v-icon>
      </nuxt-link>
      <v-toolbar-title class="text-h6 font-medium ml-n4 ps-6 " style="text-transform: capitalize !important;" >
        {{translate(MainTitle)}}
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="bg-white">
      <v-container class="pa-6">
        <div 
          v-for="(guid, i) in guids" 
          :key="i"
          class="mb-12"
        >
          <v-row no-gutters align="start">
            <v-col cols="auto">
              <v-avatar 
                color="#3E6B7E" 
                size="48" 
                class="elevation-2"
              >
                <span class="text-h6 text-white font-weight-bold">{{ i + 1 }}</span>
              </v-avatar>
            </v-col>

            <v-col class="ps-4">
              <div class="font-kantumruy mb-1 font-semibold text-[#35667D]" >
                {{ guid.title.split("||")[1] }}
              </div>
              <div class="text-body-2 font-semibold">
                {{ guid.title.split("||")[0] }}
              </div>
            </v-col>
          </v-row>

          <div class="d-flex justify-center w-full mt-4 py-6 ">
            <v-img
              :src="guid.image_url"
              max-width="180"
              contain >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-4" />
                </v-row>
              </template>
            </v-img>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
    import { useRouter, useRoute } from 'vue-router'
    import { useNuxtApp } from '#app';
    
    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;

    const router = useRouter()
    const route = useRoute()
    const slug = route.params.slug || 'washing'
    const MainTitle = slug + "_guides";
    import { useGuideStore } from '~/store/guide'

    const { $alert } = useNuxtApp();

    const guideStore = useGuideStore()

    const guids = computed(() => (guideStore.guides || []).filter(guide => guide.type === slug))
    const isLoading = ref(true)

      
    onMounted(async () => {
      try {
        await guideStore.fetchGuides();
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load news'
        $alert.error(msg)
      } finally {
        isLoading.value = false
      }
    })

    definePageMeta({
        layout: 'detailLayout'
    });

</script>

<style scoped>
    @font-face {
      font-family: 'Kantumruy Pro';
      src: url('/fonts/KantumruyPro-VariableFont_wght.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }

    .font-kantumruy {
        font-family: 'Kantumruy Pro', serif;
        font-size: 20px; 
    }
</style>