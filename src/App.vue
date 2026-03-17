<template>
  <v-app :theme="settingsStore.theme" :style="appStyle">
    <v-app-bar density="comfortable" flat border>
      <v-app-bar-title class="font-weight-bold">Notes Manager</v-app-bar-title>
      <v-btn to="/" variant="text" prepend-icon="mdi-note-multiple-outline">Notes</v-btn>
      <v-btn to="/settings" variant="text" prepend-icon="mdi-cog-outline">Settings</v-btn>
      <v-spacer />
      <v-btn
        v-if="authStore.user"
        variant="text"
        prepend-icon="mdi-logout"
        @click="authStore.logout"
      >
        Logout
      </v-btn>
      <v-btn
        v-else
        to="/login"
        variant="text"
        prepend-icon="mdi-login"
      >
        Login
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>

    <v-snackbar v-model="needRefresh" timeout="-1" location="bottom right">
      New version available.
      <template #actions>
        <v-btn color="primary" variant="text" @click="updateServiceWorker()">Update</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useAuthStore } from './stores/auth';
import { useSettingsStore } from './stores/settings';

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const { needRefresh, updateServiceWorker } = useRegisterSW();

watch(
  () => settingsStore.theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value);
  },
  { immediate: true }
);

const appStyle = computed(() => ({
  '--app-font-family': settingsStore.fontFamily,
  '--app-font-size': `${settingsStore.fontSize}px`,
}));
</script>

<style>
:root {
  --app-font-family: Inter, system-ui, sans-serif;
  --app-font-size: 16px;
}

.v-application {
  font-family: var(--app-font-family);
  font-size: var(--app-font-size);
}
</style>
