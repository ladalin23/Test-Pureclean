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
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useNuxtApp } from '#app'
  import { useGuideStore } from '~/store/guide'

  const nuxtApp = useNuxtApp()
  const translate = nuxtApp.$translate as (key: string) => string
  const { $alert } = nuxtApp
  const router = useRouter()
  const route = useRoute()
  const slug = (route.params.slug as string) || 'washing'
  const MainTitle = slug + "_guides";


  const guideStore = useGuideStore()
  const isLoading = ref(true)

  // guidDetail fallback data
  const guidDetail = {
    washing: [
      { title: 'Load clothes in machine, Close side||ដាក់សំលៀកបំពាក់ហើយបិទទ្វារ', image_url: '/images/Guids/ClothInMachine.png' },
      { title: 'Add liquid detergent & Fabric softener||ដាក់ទឹកសាប៊ូ និងទឹកក្រអូបសម្រាប់បោកគក់ សំលៀកបំពាក់', image_url: '/images/Guids/FabricSoftener.png' },
      { title: 'Select water temperature setting||ជ្រើសរើសសីតុណ្ហភាពទឹកសម្រាប់ប្រើក្នុងការបោកគក់', image_url: '/images/Guids/waterTemperature.png' },
      { title: 'Select drying temperature||ជ្រើសរើសសីតុណ្ហភាពក្នុងការសម្ងួត', image_url: '/images/Guids/dryingTemperature.png' },
      { title: 'Press Start button||ចុចប៊ូតុង Start ដើម្បីចាប់ផ្តើមការសម្ងួត', image_url: '/images/Guids/ButtonStart.png' }
    ],
    drying: [
      { title: 'Load clothes in machine, Close side||ដាក់សំលៀកបំពាក់ហើយបិទទ្វារ', image_url: '/images/Guids/ClothInMachine.png' },
      { title: 'Select water temperature setting||ជ្រើសរើសសីតុណ្ហភាពទឹកសម្រាប់ប្រើក្នុងការបោកគក់', image_url: '/images/Guids/waterTemperature.png' },
      { title: 'Select drying temperature||ជ្រើសរើសសីតុណ្ហភាពក្នុងការសម្ងួត', image_url: '/images/Guids/dryingTemperature.png' },
      { title: 'Press Start button||ចុចប៊ូតុង Start ដើម្បីចាប់ផ្តើមការសម្ងួត', image_url: '/images/Guids/ButtonStart.png' }
    ]
  }

  // Reactive guides array
  const guids = ref([] as Array<any>)

  onMounted(async () => {
    isLoading.value = true
    try {
      await guideStore.fetchGuides()

      // Filter by slug if store has guides, else fallback to guidDetail
      if (guideStore.guides.length > 0) {
        guids.value = guideStore.guides.filter(guide => guide.type === slug)
      } else {
        guids.value = guidDetail[slug] || []
      }

    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load guides'
      $alert.error(msg)
      guids.value = guidDetail[slug] || []
    } finally {
      isLoading.value = false
    }
  })

  definePageMeta({
    layout: 'detailLayout'
  })
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