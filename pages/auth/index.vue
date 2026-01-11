<template>
  <div class="mt-8">
    <AuthLogin/>
  </div>
</template>

<script setup>
import {userAuth} from "~/store/userAuth";
import {useRouter} from 'vue-router' // 👈 Import router!
import {onMounted} from "vue";
import { useSeoMeta } from '#app';

useSeoMeta({
  title: 'Login | Sign Up | OneDash Cambodia',
  ogTitle: 'Login | Sign Up | OneDash Cambodia',
  description: 'Login to your OneDash Cambodia account to access your personalized laundry services, including easy pickup and delivery.',
  ogDescription: 'Login to manage your orders and access our high-quality laundry services. OneDash Cambodia offers reliable and affordable laundry services with free pickup and delivery.',
  keywords: 'OneDash Cambodia, login, laundry services, Phnom Penh, laundry pickup and delivery, account login',
  ogImage: 'https://onedashcambodia.com/logo/OneDash-Rec-Orange.jpeg', // Use a relevant image for social sharing
});

const useUserAuth = userAuth();
const router = useRouter(); // 👈 Create router instance

onMounted(() => {
  useUserAuth.initializeSession();
  if (useUserAuth.isLoggedIn) {
    router.push('/'); // 👈 Redirect to Home if already logged in
  }
});

definePageMeta({
  layout: 'pageLayouts'
});
</script>