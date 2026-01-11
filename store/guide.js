import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useGuideStore = defineStore('guide', ()=>{
    const { $AdminPrivateAxios: api } = useNuxtApp();

    const guides = ref([]);

    const fetchGuides = async () => {
        const res = await api.get('/guides')
        const pageData = res?.data?.data || {}   // paginator object
        guides.value = Array.isArray(pageData.data) ? pageData.data : []   // <-- ARRAY
    }
    return {
        guides,
        fetchGuides,
    };
});