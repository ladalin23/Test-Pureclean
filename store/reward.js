import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useRewardStore = defineStore('reward', ()=>{
    const { $AdminPrivateAxios: api } = useNuxtApp();

    const rewards = ref([]);

    const fetchRewards = async () => {
        const res = await api.get('/rewards')
        const pageData = res?.data?.data || {}   // paginator object
        rewards.value = Array.isArray(pageData) ? pageData : []   // <-- ARRAY
    }
    return {
        rewards,
        fetchRewards,
    };
});