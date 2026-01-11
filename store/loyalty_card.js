import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useLoyaltyCardStore = defineStore('loyalty_card', () => {
    const { $AdminPrivateAxios: api } = useNuxtApp();

    const loyaltyCards = ref([]);
    const loyaltyCard = ref([]);

    const fetchLoyaltyCards = async () => {
        try {
            const res = await api.get('/loyalty-cards')
            const pageData = res?.data?.data || {}   // paginator object
            loyaltyCards.value = Array.isArray(pageData) ? pageData : [pageData]
            loyaltyCard.value = loyaltyCards.value[loyaltyCards.value.length - 1];
            if (loyaltyCards.value.length > 1 && !loyaltyCard.value?.purchase1) {
                loyaltyCard.value = loyaltyCards.value.at(-2)
            }
            
            const purchasesArray = [];

            for (let i = 1; i <= 11; i++) {
                const purch = loyaltyCard.value[`purchase${i}`]; // ✅ use .value
                if (purch) {
                    let color = '';
                    if (purch.status === 'Warm') color = 'orange';
                    else if (purch.status === 'Cold') color = 'blue';
                    else if (purch.status === 'Hot') color = 'red';
                    else if (purch.status === 'Dry') color = 'green';

                    purchasesArray.push({
                        active: true,
                        status: purch.status.charAt(0).toUpperCase(),
                        color
                    });
                } else {
                    purchasesArray.push({
                        active: false,
                        status: '',
                        color: ''
                    });
                }
            }
            
            loyaltyCard.value = purchasesArray;
            
        } catch (err) {
            console.error('Failed to fetch loyalty cards:', err);
        }
    }

    return {
        loyaltyCards,
        loyaltyCard,
        fetchLoyaltyCards,
    };
});