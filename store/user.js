import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useUserStore = defineStore('user', ()=>{
    const { $AdminPrivateAxios: api } = useNuxtApp();

    const users = ref([]);
    const meta = ref(null)       // keep pagination info separately (optional)
    const user = ref(null);

    const fetchUser = async (params = {}) => {
        const res = await api.get('/users', { params })
        const pageData = res?.data?.data || {}   // paginator object
        user.value = pageData || ''   // <-- ARRAY
    }

    const updateUser = async (p) => {
        const res = await api.put('/users', p)
        user.value = res.data.data

        return res
    }

    return {
        user,
        fetchUser,
        updateUser,
    };
});