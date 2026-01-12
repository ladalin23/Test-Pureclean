<template>
  <v-card
    class="loyalty-background rounded-xl pa-2 sm:pa5 pa-md-10 text-white d-flex flex-column justify-space-between overflow-hidden card-container"
    elevation="4"
  >
    <div class="text-center mb-0 sm:mb-2">
      <h3 class="font-amoria mb-0 text-h5 text-md-h3">LOYALTY CARD</h3>
      <div class="d-flex flex-column align-center mt-1">
        <div class="w-75 w-md-50 h-px bg-white opacity-60"></div>
        <div class="w-25 w-md-15 h-px bg-white opacity-60 mt-1"></div>
      </div>
    </div>

    <div class="d-flex align-center justify-space-between flex-grow-1 my-0 sm:my-4">
      <div class="stamps-grid flex-grow-1 mr-4 relative">
        <div
          v-for="(stamp, i) in loyaltyCard.slice(0, 10)"
          :key="i"
          class="stamp-wrapper"
        >
          <div class="jagged-stamp " :class="{ 'is-active': stamp.stutus }">
            <span
              v-if="stamp.status && i < 10"
              :style="{ color: stamp.color }"
              class="text-[20px] md:text-[40px] font-weight-black"
            >
              {{ stamp.status }}
            </span>
             
          </div>
        </div>
        
        <div class=" w-[30px] h-[30px] md:w-[46px] md:h-[46px] xl:w-[46px] xl:h-[46px] absolute top-[-1px] right-[-8px]">
          <Icon
            name="bottle"
            :color="loyaltyCard[4]?.active ? '#ff8100' : '#9AB2BE'"
          />
        </div>
      </div>

      <div class="reward-box rounded-xl d-flex flex-column align-center justify-center pa-4 text-center shadow-inner"
          :style="`background-color: ${loyaltyCard[10]?.active ? '#ff8100' : '#ffffff'}`">
        <div class="w-[26px] h-[26px] md:w-[46px] md:h-[46px] xl:w-[46px] xl:h-[46px]">
          <Icon
            name="cart"
            :color1="loyaltyCard[10]?.active ? '#ffffff' : '#9AB2BE'"
            :color2="loyaltyCard[10]?.active ? '#ff8100' : '#ffffff'"
          />
        </div>
        <span class="text-[12px] leading-[1.2] uppercase grey--text text--darken-2 font-weight-bold mt-2"
              :style="`color: ${loyaltyCard[10]?.active ? '#ffffff' : '#9AB2BE'}`">
          Free Washing
        </span>
      </div>
    </div>

    <p class="text-center text-caption text-md-body-1 mb-0 opacity-90">
      Complete 10 Washes, Get 1 Free
    </p>
  </v-card>
</template>


<script setup>
    import Icon from '@/components/Icons.vue';
    import { defineProps } from 'vue'

    const props = defineProps({
      loyaltyCard: {
        type: Array,
        required: true
      }
    })

</script>

<style scoped>

    .loyalty-background {
        background-image: url('/images/Background/Clip_path_group.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    
    @font-face {
        font-family: 'Amoria';
        src: url('/fonts/AMORIA-BF64a2f6809ce9e.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }

    .font-amoria {
        font-family: 'Amoria', serif;
        letter-spacing: 2px;
        font-weight: 300;
    }
    .card-container {
        /* Height adjustments to match aspect ratio */
        aspect-ratio: 1.6 / 1;
      }

      /* 5 columns x 2 rows grid */
      .stamps-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 12px;
      }

      .stamp-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Generating the Jagged Shape with CSS Clip-path */
      .jagged-stamp {
        width: 100%;
        aspect-ratio: 1/1;
        max-width: 100px;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        /* This creates a 20-point star/stamp shape */
        clip-path: polygon(50% 0%, 58% 6%, 69% 3%, 74% 12%, 85% 12%, 87% 23%, 97% 26%, 94% 37%, 100% 47%, 94% 57%, 97% 68%, 87% 71%, 85% 82%, 74% 82%, 69% 91%, 58% 88%, 50% 94%, 42% 88%, 31% 91%, 26% 82%, 15% 82%, 13% 71%, 3% 68%, 6% 57%, 0% 47%, 6% 37%, 3% 26%, 13% 23%, 15% 12%, 26% 12%, 31% 3%, 42% 6%);
      }

      .mini-bottle {
        position: absolute;
        top: -5px;
        right: -5px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
      }

      /* The White Box on the right */
      .reward-box {
        width: 120px;
        height: 160px;
        flex-shrink: 0;
      }

      @media (max-width: 600px) {
        .reward-box { width: 80px; height: 110px; padding: 8px !important; }
        .reward-text { font-size: 10px; }
        .stamps-grid { gap: 6px; }
      }
</style>