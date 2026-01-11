<template>
  <v-container class="error-page" fluid>
    <v-row class="fill-height d-flex align-center justify-center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <!-- Error Message -->
        <v-chip color="blue lighten-4" class="text-caption font-weight-bold mb-3">
          Page Not Found
        </v-chip>

        <h1 class="text-h4 font-weight-bold text-primary">OhNo! Error 404</h1>

        <p class="text-body-1 mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>

        <p class="text-body-2 mb-6">
          It might have been moved, deleted, or the URL could be incorrect.
        </p>

        <v-btn color="primary" to="/" class="white--text" elevation="2">
          Home Page
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- <script>
export default {
  props: ['error'],
};
</script> -->

<script setup>
definePageMeta({
  layout: false,
})

throw createError({ statusCode: 404, statusMessage: 'Page not found' })
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
