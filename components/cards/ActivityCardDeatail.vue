<template>
</template>


<script setup>
    import { useRouter } from 'vue-router'
    import { useNewsStore } from '~/store/news'

    const { $alert } = useNuxtApp();

    const newsStore = useNewsStore()

    const News = ref([])
    const isLoading = ref(true)

      
    onMounted(async () => {
      try {
        isLoading.value = true
        await newsStore.fetchNews();
        News.value = newsStore.news || []
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load news'
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
