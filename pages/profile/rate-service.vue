<template>
  <v-app>
    <v-main class="bg-[#FFFFFF] dark:bg-[#191919] font-roboto" style="color: #323232 !important" >
      <v-container class="pa-6 pt-12 ">
        <header class="d-flex justify-between mb-12 py-1 align-center ">
            <nuxt-link to="/profile" >
                <v-icon size="28" class=" dark:text-[#FFFFFF]">mdi-chevron-left</v-icon>
            </nuxt-link>
            <p class="font-medium text-[20px] leading-[30px] tracking-normal dark:text-[#FFFFFF]">{{translate("languages")}}</p>
            <p></p>
        </header>
        <div class="w-full mb-[26px]">
            <h6 class="text-h6 font-medium px-0 mb-7  dark:text-[#FFFFFF]">
                {{translate("how_was_your_experience")}}?
            </h6>
            <div class="mb-6 w-full">
                <label class="text-[#7F7F7F] text-sm mb-3">{{translate("rating")}}</label>
                <div class="flex justify-center py-2">
                    <StarRating v-model="rating" :size="48" />
                </div>
            </div>

            <div class="mb-6">
                <label class="text-sm dark:text-[#FFFFFF]">{{translate("write_your_feedback")}}</label>
                <v-textarea
                    v-model="message"
                    :placeholder="translate('add_your_comment')"
                    variant="outlined"
                    rounded="lg"
                    auto-grow
                    rows="5"
                    class="custom-textarea mt-3 text-[#7F7F7F]"
                ></v-textarea>
            </div>

            <v-btn
                block
                size="x-large"
                color="#3d6a7e"
                class="text-none text-white rounded-pill"
                flat
                @click="submitFeedback"
            >
                {{translate("sent")}}
            </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { useFeedbackStore } from '~/store/feedback'
    import { useNuxtApp } from '#app';

    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;

    const feedbackStore = useFeedbackStore()
    const { $alert } = useNuxtApp()
    const rating = ref(0)
    const message = ref('')
    const router = useRouter();

    definePageMeta({
        layout: 'blank'
    });

    
    const submitFeedback = async () => {
        // Basic validation
        if (rating.value === 0) {
            return
        }
        if (!message.value.trim()) {
            return
        }
        const payload = {
            rating: rating.value,
            message: message.value.trim(),
        }
        try {
            const res = await feedbackStore.createFeedback(payload)
            $alert.toast('Thank you for your feedback!')

            rating.value = 0
            message.value = ''
        } catch (err) {
            $alert.error('Error sending feedback. Please try again.')
        }
    }

    
</script>