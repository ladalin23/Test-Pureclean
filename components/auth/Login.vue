<template>
  <v-container fluid class="d-flex align-center justify-center ">
  <img src="/images/Background/washing-machine-isolated.png" alt="" class="w-full h-full object-cover opacity-90 absolute top-0 z-0">
    <v-row justify="center" 
    class="w-full absolute top-0 z-10 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(241,245,247,0.2)_60%,rgba(230,235,238,0.1)_100%)] ">
      <v-col cols="12" class="relative">
        <section class="px-6 mt-[157px]">
          <h1 class="text-[32px] font-bold leading-tight text-[#2D5467] tracking-tight">
            Tired of Spending<br />
            Hours Doing Laundry?
          </h1>
        </section>
          <div class="d-flex justify-center mb-4">
            <TelegramLogin/>
          </div>
        <section class="absolute bottom-[47px] left-0 w-full px-6">
          <button 
            class="w-full bg-[#3E6B7E] hover:bg-[#325868] text-white py-4 rounded-full text-lg font-medium transition-colors shadow-md"
            @click="handleSignIn()"
          >
            Sign In
          </button>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import TelegramLogin from '~/components/auth/TelegramLogin.vue';

  const handleSignIn = (path) => {
      window.location.href = '/';
  };

</script>