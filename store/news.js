import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useNewsStore = defineStore('news', ()=>{
    const { $AdminPrivateAxios: api } = useNuxtApp();

    const news = ref([]);
    const singleNews = ref(null);

    const fetchNews = async () => {
        const res = await api.get('/news')
        const pageData = res?.data?.data || {}   // paginator object
        news.value = Array.isArray(pageData.data) ? pageData.data : []   // <-- ARRAY
    }
    
    const fetchNew = async (id) => {
        const res = await api.get(`/news/${id}`);
        singleNews.value = res?.data?.data;
    };

    return {
        news,
        singleNews,
        fetchNews,
        fetchNew,
    };
    
});