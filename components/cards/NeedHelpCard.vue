<template>
  <div class="w-full py-4 mt-8">

    <!-- Slider -->
    <div
      class="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
    >
      <!-- Slide -->
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex-none w-full snap-start"
      >
        <div class="relative h-[408px] md:h-[518px] rounded-[16px] overflow-hidden">
          <!-- Image -->
          <img
            :src="item.image"
            class="w-full h-full object-cover"
            alt=""
          />

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.1), rgba(0,0,0,0));"
          ></div>

          <!-- Content -->
          <div
            class="absolute inset-0 z-10 flex flex-col justify-end p-6"
          >
            <div class="mb-5">
              <h3 class="text-white text-[1.6rem] font-bold leading-tight">
                {{ getLangText(item.title) }}
              </h3>
              <p class="text-white/90 text-sm mt-1">
                {{ getLangText(item.subtitle) }}
              </p>
            </div>

            <button
              class="w-full bg-[#3E6B7E] hover:bg-[#325868] text-white py-2 rounded-full text-lg font-medium transition-colors shadow-md flex items-center justify-center gap-2"
              @click="goToDetails(item.slug)"
            >
              {{translate("learn_more")}}
              <v-icon icon="mdi-chevron-right" size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- End Spacer -->
      <div class="flex-none w-1"></div>
    </div>
  </div>
</template>


<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { useNuxtApp } from '#app';
    import { getLangText } from '~/config/pageHelper'

    const nuxtApp = useNuxtApp();
    const translate = nuxtApp.$translate as (key: string) => string;

    const router = useRouter()

    const goToDetails = (slug) => {
        router.push(`/need-help/${slug}`)
    }
    const items = [
      {
          slug: 'washing',
          title: 'Washing Guids||ការណែនាំអំពីការបោកគក់',
          subtitle: 'Simple Steps for Better Laundry Results.||ជំហានសាមញ្ញៗសម្រាប់លទ្ធផលបោកគក់កាន់តែប្រសើរ។',
          image: '/images/NeedHelp/CLothes_in_grass_field.jpg'
      },
      {
          slug: 'drying',
          title: 'The Right Way to Dry||វិធីត្រឹមត្រូវដើម្បីសម្ងួត',
          subtitle: 'Essential Drying Tips for Cleaner Results.||គន្លឹះសំខាន់ៗសម្រាប់សម្ងួតសម្រាប់លទ្ធផលស្អាតជាងមុន។',
          image: '/images/NeedHelp/Natural_drying.jpg'
      }
    ]
</script>

<style scoped>
/* 1. LAYOUT & SCROLLING */
.v-laundry-slider-wrapper {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 0px;
  gap: 16px;
}

/* SETTING WIDTH TO 90% */
.v-laundry-slide-column {
  flex: 0 0 100%; 
  scroll-snap-align: start;
}

.v-laundry-end-spacer {
  flex: 0 0 4px;
}

/* 2. CARD DESIGN */
.v-laundry-guide-card {
  height: 400px;
  border-radius: 36px !important; /* Very round corners like image */
  overflow: hidden;
  position: relative;
}

.v-laundry-img-layer {
  height: 100%;
}
 

/* 3. CONTENT PLACEMENT */
.v-laundry-content-box {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
}

.v-laundry-card-heading {
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
}

.v-laundry-card-subheading {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-top: 4px;
}

/* 4. BUTTON & THEME */
.v-laundry-cta-button {
  background-color: #3b6b85 !important; /* Matches image teal */
  color: white !important;
  font-weight: 600;
  font-size: 1rem;
}

.v-laundry-main-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
}

/* 5. UTILITY */
.v-laundry-no-scrollbar::-webkit-scrollbar {
  display: none;
}
.v-laundry-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>