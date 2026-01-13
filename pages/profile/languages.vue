<template>
  <v-app>
    <v-main class="bg-[#FFFFFF] dark:bg-[#191919] font-roboto" style="color: #323232 !important">
      <v-container class="pa-6 pt-12">
        <!-- Header -->
        <header class="d-flex justify-between mb-12 py-1 align-center">
          <nuxt-link to="/profile">
            <v-icon size="28" class=" dark:text-[#FFFFFF]">mdi-chevron-left</v-icon>
          </nuxt-link>
          <p class="font-medium text-[20px] leading-[30px] tracking-normal dark:text-[#FFFFFF]">
            {{ translate('languages') }}
          </p>
          <p></p>
        </header>

        <!-- Language List -->
        <div class="w-full mb-[26px]">
          <v-list class="!text-[#7F7F7F] bg-transparent">
            <v-list-item
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              rounded="lg"
              class="mb-4 transition-all dark!bg-[#323232]"
              :class="selectedLanguage === lang.code ? '!bg-[#EAEFF2] !text-[#35667D]' : '!bg-transparent dark:!bg-[#323232]  dark:text-[#FFFFFF]'"
            >
              <template v-slot:prepend>
                <v-img :src="lang.flag" width="32" class="mr-4 rounded-sm" />
              </template>

              <v-list-item-title
                :class="selectedLanguage === lang.code ? 'font-weight-bold' : ''"
              >
                {{ lang.title }}
              </v-list-item-title>

              <template v-slot:append>
                <v-icon
                  v-if="selectedLanguage === lang.code"
                  icon="mdi-check"
                  color="#455A64"
                  size="24"
                />
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCookie, useNuxtApp } from '#app';

// Access nuxtApp to get the plugin values safely
const nuxtApp = useNuxtApp();
const currentLang = nuxtApp.$currentLang as Ref<'en' | 'km'>;
const translate = nuxtApp.$translate as (key: string) => string;

// Cookie to persist language
const languageCookie = useCookie('lang');

// Only English and Khmer
const languages = [
  { title: 'English', code: 'en', flag: 'https://flagcdn.com/w80/gb.png' },
  { title: 'Khmer', code: 'km', flag: 'https://flagcdn.com/w80/kh.png' }
];

// Reactive variable for UI highlight
const selectedLanguage = ref<'en' | 'km'>('en');

// On mount, sync with cookie / currentLang
onMounted(() => {
  selectedLanguage.value = currentLang.value || languageCookie.value || 'en';
});

// Change language function
const changeLanguage = (langCode: 'en' | 'km') => {
  selectedLanguage.value = langCode;
  languageCookie.value = langCode;
  currentLang.value = langCode;
};
</script>
