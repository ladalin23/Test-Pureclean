<template>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import { defineProps } from 'vue'

    const props = defineProps({
      News: {
        type: Array,
        required: true
      }
    })

    const router = useRouter()
    const goToDetail = (id) => {
        router.push(`/news-activity/${id}`)
    }
</script>