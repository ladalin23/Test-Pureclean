<!-- components/AuthLogin.vue -->
<template>
  <v-card class="login-card mx-auto" elevation="8">
    <v-card-title class="d-flex text-h6 font-semibold justify-center py-4">
      Welcome back
    </v-card-title>

    <v-divider />

    <v-card-text class="pt-6">
      <v-form ref="formRef" v-model="isValid" @submit.prevent="onSubmit">
        <div class="pb-2">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            variant="outlined"
            :rules="emailRules"
            prepend-inner-icon="mdi-email-outline"
            :hide-details="false"
            hint="botumsakor@gmail.com"
            required
          />
        </div>

        <div>
          <v-text-field
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            label="Password"
            autocomplete="current-password"
            variant="outlined"
            :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPass = !showPass"
            :hide-details="false"
            hint="At least 6 characters"
            required
          />
        </div>

        <!-- Reserve space for alert so button doesn't jump -->
        <div class="feedback-slot">
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            density="comfortable"
          >
            {{ errorMessage }}
          </v-alert>
        </div>

        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-4"
          size="x-large"
          :loading="loading"
          :disabled="loading || !isValid"
        >
          Sign in
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { userAuth } from '~/store/userAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = userAuth()

const formRef = ref(null)
const isValid = ref(false)
const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const emailRules = [
  v => !!v || 'Email is required',
  v => /^\S+@\S+\.\S+$/.test(v) || 'Enter a valid email',
]
const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 6) || 'At least 6 characters',
]

async function onSubmit () {
  errorMessage.value = ''
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    await auth.login(email.value, password.value)
    // await auth.initializeSession?.()
    router.push(auth.redirectTo || '/')
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.message || err?.message || 'Login failed. Please check your email and password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 14px;
}

/* Keep the area under fields stable even when alert toggles */
.feedback-slot {
  min-height: 48px; /* roughly one alert height; adjust 0–56px to taste */
  display: grid;
  align-items: start;
}
</style>
