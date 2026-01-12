<template>
    <v-main class="d-flex align-center justify-center font-roboto h-[89vh] sm:h-[87vh]" >
    <img src="/images/Background/QR_Code.png" alt="" class="w-full h-full object-cover opacity-90 absolute bottom-0 z-0">
    <v-container fluid class="fill-height z-10 qr-payment-bg d-flex flex-column align-center justify-center text-white pa-6 mt-[90px] sm:mt-[150px]">
      <div class="text-center mb-5 sm:mb-5">
        <h1 class="text-[28px] font-medium z-10 mb-0 sm:mb-2">{{translate("my_qr")}}</h1>
        <p class="text-[14px] font-normal">
          {{ translate("ready_to_scan_showthis_qr_code_to") }} <br /> {{translate("the_merchant")}}
        </p>
      </div>

      <v-card
        elevation="4"
        rounded="xl"
        class="pa-6 mb-4 d-flex align-center justify-center"
        width="100%"
        max-width="350"
        aspect-ratio="1">
        <img :src="qrcode" alt="QR Code" width="350" height="350" />
      </v-card>

      <div class="d-flex ga-10">
        <div class="d-flex flex-column align-center">
            <button
              class="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-white shadow-md mb-2">
              <v-icon icon="mdi-tray-arrow-down" size="24" color="#7F7F7F" />
            </button>
          <span class="text-caption font-normal font-[12px]">{{translate("download")}}</span>
        </div>

        <div class="d-flex flex-column align-center">
          <button
            class="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-white shadow-md mb-2">
            <v-icon icon="mdi-share-variant" size="24" color="#7F7F7F" />
          </button>
          <span class="text-caption font-normal font-[12px]">{{translate("share")}} QR</span>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import QRCode from 'qrcode'
  import { userAuth } from '~/store/userAuth';
  import { storeToRefs } from 'pinia'
  import { useNuxtApp } from '#app';

  const nuxtApp = useNuxtApp();
  const translate = nuxtApp.$translate as (key: string) => string;

  const auth = userAuth()
  const { user, isLoggedIn } = storeToRefs(auth)

  const currentUser = computed(() => user.value || null)

  const qrcode = ref('')

  onMounted(async () => {
    qrcode.value = await QRCode.toDataURL(currentUser.value.global_id, {
      width: 350,
      height: 350,
      margin: 0,
    })
  })

</script>

<style>
    
</style>