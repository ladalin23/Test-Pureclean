<template>
  <v-app>
    <v-main class="bg-[#FFFFFF] dark:bg-[#191919] font-roboto" style="color: #323232 !important" >
        <div v-if="isLoading" class="flex justify-center items-center h-[80vh]">
            <v-progress-circular indeterminate color="primary" size="70"></v-progress-circular>
        </div>
        <v-container v-else class="pa-6 pt-12 ">
            <header class="d-flex justify-between mb-12 py-1 align-center ">
                <nuxt-link to="/profile" >
                    <v-icon size="28" class="dark:text-[#FFFFFF]">mdi-chevron-left</v-icon>
                </nuxt-link>
                <p class="font-medium text-[20px] leading-[30px] tracking-normal dark:text-[#FFFFFF]">{{translate("user_informations")}}</p>
                <p></p>
            </header>
            <div class="text-center mb-8 w-full text-[#323232]">
                <div class="position-relative d-inline-block rounded-full border-2 border-[#35667D]">
                    <v-avatar size="100">
                        <v-img :src="currentUser.profile_picture" :alt="currentUser.username" />
                    </v-avatar>
                    <v-btn
                        icon="mdi-pencil"
                        size="x-small"
                        color="#35667D"
                        class="position-absolute"
                        style="bottom: 1px; right: 2px;"
                    ></v-btn>
                </div>
                
                <h3 class="mt-3 text-h6 font-medium" style="text-transform: capitalize !important;" >{{userData.username}}</h3>
            </div>
            <v-container class="fill-height justify-center">
                <v-form class="w-full">
                    <div class="Class	Value (rem)	Value (px)">
                    <label class="text-sm mb-2 text-[#7F7F7F] dark:text-[#FFFFFF]">{{translate("username")}}</label>
                    <v-text-field
                        v-model="userData.username"
                        variant="outlined"
                        density="comfortable"
                        class="custom-field dark:text-[#FFFFFF]"
                        :placeholder="translate('input_username')"
                        hide-details
                    ></v-text-field>
                    </div>

                    <div class="mt-5">
                        <label class="text-sm mb-2 text-[#7F7F7F] dark:text-[#FFFFFF]">{{translate("gender")}}</label>
                        <v-select
                            v-model="userData.gender"
                            :items="genderOptions"
                            item-title="title"
                            item-value="value"
                            variant="outlined"
                            density="comfortable"
                            class="custom-field dark:text-[#FFFFFF]"
                            :placeholder="translate('select_gender')"
                            hide-details
                        />
                    </div>

                    <div class="mt-5">
                        <label class="text-sm mb-2 text-[#7F7F7F] dark:text-[#FFFFFF]">{{translate("dob")}}</label>

                        <v-menu
                            v-model="dobMenu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            max-width="290px"
                        >
                            <template #activator="{ props }">
                            <v-text-field
                                v-model="formattedDob"
                                v-bind="props"
                                variant="outlined"
                                density="comfortable"
                                class="custom-field dark:text-[#FFFFFF]"
                                :placeholder="translate('select_dob')"
                                readonly
                                hide-details
                            />
                            </template>

                            <v-date-picker
                                v-model="userData.dob"
                                @update:model-value="dobMenu = false"
                            />
                        </v-menu>
                    </div>

                    <div class="mt-1 mt-5">
                        <label class="text-sm mb-2  text-[#7F7F7F] dark:text-[#FFFFFF]">{{translate("phone")}}</label>
                        <v-text-field
                            v-model="userData.phone"
                            variant="outlined"
                            density="comfortable"
                            class="custom-field dark:text-[#FFFFFF]"
                            :placeholder="translate('input_phone')"
                            hide-details
                        ></v-text-field>
                    </div>
                </v-form>
            </v-container>
            
            <section class="absolute bottom-[47px] left-0 w-full px-6">
            <button 
                class="w-full bg-[#3E6B7E] hover:bg-[#325868] text-white py-4 rounded-full text-lg font-medium transition-colors shadow-md"
                @click="handleSubmit()"
            >
                {{translate("save")}}
            </button>
            </section>
        </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
    import { useUserStore } from '~/store/user'
    import { ref, computed, onMounted } from 'vue'
    import { userAuth } from '~/store/userAuth';
    import { storeToRefs } from 'pinia'
    import { useNuxtApp } from '#app';

    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;
    const userStore = useUserStore()
    const userData = ref([])
    const isLoading = ref(false) // you were using isLoading but not defined
    const auth = userAuth()
    const { user, isLoggedIn } = storeToRefs(auth)
    const currentUser = computed(() => user.value || null)


    onMounted(async () => {
        try {
            isLoading.value = true
            await userStore.fetchUser() // <- .value.id
            userData.value = userStore.user || []
        } catch (error) {
            console.error('Failed to fetch user:', error)
        } finally {
            isLoading.value = false
        }
    })

    //form
    const genderOptions = [
        { title: 'Male', value: 'male' },
        { title: 'Female', value: 'female' },
        { title: 'Other', value: 'other' },
    ]
    const dobMenu = ref(false)
    const formattedDob = computed(() => {
        if (!userData.value?.dob) return ''

        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(userData.value.dob))
    })

    const handleSubmit = async () => {
        try {
            isLoading.value = true
            let dobForDB = null
            if (userData.value.dob) {
            const date = new Date(userData.value.dob)
            const pad = n => String(n).padStart(2, '0')

            dobForDB = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} 00:00:00`}

            const payload = {
                username: userData.value.username,
                gender: userData.value.gender,
                dob: dobForDB,
                phone: userData.value.phone
            }

            await userStore.updateUser(payload)
            // router.push('/profile') // if you want redirect
        } catch (error) {
            console.error(
            error?.response?.data?.message || 'Failed to update user'
            )
        } finally {
            isLoading.value = false
        }
    }


    definePageMeta({
        layout: 'blank'
    });
    
</script>
<style scoped>
    
        :deep(.custom-field .v-field__outline) {
            --v-field-border-color: #E6E6E6;  
            border-radius: 8px !important;
        }

        :deep(.custom-field.v-input--focused .v-field__outline) {
            --v-field-border-opacity: 1;
            color: #35667D;
        }

</style>