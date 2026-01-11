import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useFeedbackStore = defineStore('feedback', ()=>{
    const { $AdminPrivateAxios: api } = useNuxtApp();
    
    const createFeedback = async (payload) => {
        const res = await api.post('/feedbacks', payload)
        return res
    }

    return {
        createFeedback,
    };
});