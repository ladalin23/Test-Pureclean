<template>
    <v-main class="d-flex align-center justify-center font-roboto bg-white" >
      <v-container fluid class="fill-height d-flex flex-column align-center justify-center pa-6 pt-12">
        <div class="text-center mb-8 w-full text-[#323232]">
            <h2 class="text-h6 font-medium mb-12 my-2">{{translate("my_profile")}}</h2>
            
            <div class="position-relative d-inline-block rounded-full border-2 border-[#35667D]">
                <v-avatar size="100">
                    <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="Srun Khyn" />
                </v-avatar>
                <v-btn
                    icon="mdi-pencil"
                    size="x-small"
                    color="#35667D"
                    class="position-absolute"
                    style="bottom: 1px; right: 2px;"
                ></v-btn>
            </div>
            
            <h3 class="mt-3 text-h6 font-medium" style="text-transform: capitalize !important;" >{{currentUser.username}}</h3>
        </div>

        <div class="w-full py-3 mb-[26px]">
            <v-list class="!text-[#7F7F7F]">
                <v-list-item class="!bg-[#EAEFF2] rounded-lg mb-4" @click="handleLink('/profile/user-information')">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-account" color="#7F7F7F" size="24" ></v-icon>
                    </template>
                    <v-list-item-title class="">{{ translate("user_information") }}</v-list-item-title>
                    <template v-slot:append>
                        <v-icon icon="mdi-chevron-right" size="24"></v-icon>
                    </template>
                </v-list-item>

                <v-list-item class="!bg-[#EAEFF2] rounded-lg mb-4" @click="handleLink('/profile/languages')">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-web"></v-icon>
                    </template>
                    <v-list-item-title>{{ translate("languages") }}</v-list-item-title>
                    <template v-slot:append>
                        <v-icon icon="mdi-chevron-right" size="24"></v-icon>
                    </template>
                </v-list-item>

                <v-list-item class="!bg-[#EAEFF2] rounded-lg mb-4">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-white-balance-sunny"></v-icon>
                    </template>
                    <v-list-item-title>{{ translate("dark_mode") }}</v-list-item-title>
                    <template v-slot:append>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                v-model="enabled" 
                                class="sr-only peer"
                            >
                            <div class="w-12 h-6 bg-gray-400 rounded-full peer 
                                        peer-checked:bg-blue-600 transition-colors duration-300">
                            </div>
                            <div class="absolute left-[1px] top-[1px] w-[22px] h-[22px] bg-white rounded-full 
                                        transition-transform duration-300 
                                        peer-checked:translate-x-6">
                            </div>
                        </label>
                    </template>
                </v-list-item>

                <v-list-item class="!bg-[#EAEFF2] rounded-lg" @click="handleLink('/profile/rate-service')">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-star-outline"></v-icon>
                    </template>
                    <v-list-item-title>{{ translate("rate_our_sevice") }}</v-list-item-title>
                    <template v-slot:append>
                        <v-icon icon="mdi-chevron-right" size="24"></v-icon>
                    </template>
                </v-list-item>
            </v-list>
        </div>

        <v-btn
            variant="outlined"
            color="error"
            block
            rounded="lg"
            class="text-capitalize"
            size="large"
            @click="openLogoutModal"
        >
            {{ translate("logout") }}
        </v-btn>

        <v-btn
        icon="mdi-email"
        color="blue-darken-3"
        size="large"
        class="position-fixed"
        style="bottom: 30px; right: 20px;"
        ></v-btn>
        <!-- modal -->
         
        <v-dialog
            v-model="showLogoutModal"
            max-width="420"
            persistent
            content-class="!rounded-3xl !shadow-2xl"
            transition="scale-transition" >
            <v-card class="!rounded-3xl overflow-hidden relative border-none">
            
            <div 
                v-if="isProcessing" 
                class="absolute inset-0 z-20 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500"
            >
                <div class="relative flex items-center justify-center">
                <v-progress-circular
                    indeterminate
                    color="red-darken-1"
                    size="80"
                    width="4"
                />
                <v-icon 
                    icon="mdi-lock-open-outline" 
                    class="absolute animate-pulse" 
                    color="red-darken-1"
                />
                </div>
                <p class="mt-4 text-gray-700 font-bold tracking-wide animate-bounce">
                {{ translate("processing") }}...
                </p>
            </div>

            <div :class="['p-8 text-center transition-all duration-500', isProcessing ? 'scale-90 opacity-0' : 'scale-100 opacity-100']">
                
                <div class="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                <v-icon 
                    icon="mdi-logout" 
                    color="error" 
                    size="40"
                ></v-icon>
                </div>

                <h3 class="text-2xl font-black text-gray-900 mb-3">
                {{ translate("logout_confirmation") }}
                </h3>
                
                <p class="text-gray-500 text-base leading-relaxed mb-10">
                {{ translate("are_you_sure_logout") }}
                </p>

                <div class="flex flex-col gap-3">
                <v-btn
                    block
                    flat
                    height="56"
                    color="error"
                    class="!rounded-2xl !text-lg !font-bold !normal-case hover:!scale-[1.02] active:!scale-[0.98] transition-all !shadow-xl shadow-red-200"
                    @click="handleLogout"
                >
                    {{ translate("logout") }}
                </v-btn>

                <v-btn
                    block
                    variant="text"
                    height="56"
                    class="!rounded-2xl !text-gray-400 !font-bold !normal-case hover:!bg-gray-50 transition-colors"
                    @click="showLogoutModal = false"
                >
                    {{ translate("cancel") }}
                </v-btn>
                </div>
            </div>
            </v-card>
        </v-dialog>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { userAuth } from '~/store/userAuth';
    import { storeToRefs } from 'pinia'
    import { useNuxtApp } from '#app';

    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;
    // --- Auth store wiring ---
    const auth = userAuth()
    const { user, isLoggedIn } = storeToRefs(auth)

    // expose init flag so template can wait
    const ready = computed(() => auth._initDone)

    // initialize session from cookie/localStorage when the layout mounts
    onMounted(() => {
        auth.initializeSession()
    })

    const currentUser = computed(() => user.value || null)

    const router = useRouter()
    const handleLink = (path) => {
        router.push(path)
    }

    // --- Auth actions ---
    const showLogoutModal = defineModel();

    function openLogoutModal() {
        showLogoutModal.value = true
    }
    const isProcessing = ref(false);
    const emit = defineEmits(['confirm']);

    const handleLogout = async () => {
        isProcessing.value = true;
        try {
            await emit('confirm');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await auth.logout()
            showLogoutModal.value = false;
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

</script>