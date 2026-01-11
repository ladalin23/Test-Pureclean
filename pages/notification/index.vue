<template>
  <v-app>
    <v-main class="bg-lighten-4 font-roboto" style="color: #323232 !important" >
      <v-container class="pa-4">
        <header class="d-flex justify-between mb-7 py-1 align-center ">
            <nuxt-link to="/" >
                <v-icon size="28">mdi-chevron-left</v-icon>
            </nuxt-link>
            <p class="font-medium text-[20px] leading-[30px] tracking-normal">{{translate("notifications")}}</p>
            <p></p>
        </header>
        <v-card variant="flat" max-width="500" class="mx-auto">
            <v-list lines="two">
                <v-list-item
                v-for="(item, index) in notifications"
                :key="index"
                class="py-4"
                >
                <template v-slot:prepend>
                    <v-avatar color="orange-lighten-5" size="56" class="mr-4">
                    <v-icon :icon="item.icon" color="orange-darken-1" size="24"></v-icon>
                    </v-avatar>
                </template>

                <v-list-item-title class="!text-sm !font-normal">
                {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="!text-xs text-[#7F7F7F]">
                {{ item.subtitle }}
                </v-list-item-subtitle>

                <template v-slot:append>
                    <div class="align-self-start !text-xs text-[#7F7F7F] mt-1">
                    {{ item.date }}
                    </div>
                </template>
                </v-list-item>
            </v-list>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app';
    
    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;

    const notifications = [
        {
            title: "You've Earned a Reward!",
            subtitle: "Congrats! You've completed 5 washes.",
            date: "23 Jul",
            icon: "mdi-gift-outline",
        },
        {
            title: "Get 20% Off This Weekend!",
            subtitle: "Save on every wash this Friday to Sunday.",
            date: "28 Jul",
            icon: "mdi-tag-outline",
        },
    ];
</script>