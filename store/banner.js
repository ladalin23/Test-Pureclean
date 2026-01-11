import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useBannerStore = defineStore('banner', ()=>{
    const { $AdminPrivateAxios: api } = useNuxtApp();

    const banners = ref([]);
    const meta = ref(null)       // keep pagination info separately (optional)
    const banner = ref(null);

    const fetchBanners = async () => {
        const res = await api.get('/banners')
        const pageData = res?.data?.data || {}
        banners.value = Array.isArray(pageData.data) ? pageData.data : []
    }
    return {
        banners,
        banner,
        fetchBanners,
    };
});