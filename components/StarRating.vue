

<template>
  <div class="flex items-center gap-2">
    <button
      v-for="star in max"
      :key="star"
      type="button"
      @click="setRating(star)"
      class="transition-transform active:scale-90"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        :class="star <= modelValue ? 'text-orange-500' : 'text-gray-400'"
        :style="{ width: `${size}px`, height: `${size}px` }"
        class="transition-colors duration-200"
      >
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
  const props = defineProps({
    modelValue: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    size: { type: Number, default: 40 },
  })

  const emit = defineEmits(['update:modelValue'])

  function setRating(star) {
    emit('update:modelValue', star)
  }
</script>
