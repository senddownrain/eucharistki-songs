<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="5" lg="4">
      <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <v-text-field v-model="email" label="Email" type="email" required />
            <v-text-field v-model="password" label="Password" type="password" required />
            <v-alert v-if="authStore.error" type="error" variant="tonal" class="mb-4">
              {{ authStore.error }}
            </v-alert>
            <v-btn color="primary" type="submit" :loading="authStore.loading" block>Sign in</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (authStore.user) {
    router.push(route.query.redirect || '/');
  }
};
</script>
