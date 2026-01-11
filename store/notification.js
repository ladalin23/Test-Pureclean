import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useNotificationStore = defineStore('notification', ()=>{
  const { $AdminPrivateAxios: api } = useNuxtApp();

  const notifications = ref([]);
  const meta = ref(null);
  const single = ref(null);

  const fetchNotifications = async () => {
    const res = await api.get('/notifications')
    const pageData = res?.data?.data || {}
    notifications.value = Array.isArray(pageData.data) ? pageData.data : []
  }
  return {
    notifications,
    fetchNotifications,
  }
})
