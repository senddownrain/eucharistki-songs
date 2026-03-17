<template>
  <v-app :theme="settingsStore.theme">
    <v-navigation-drawer v-model="isDrawerOpen" temporary>
      <v-list nav density="comfortable">
        <v-list-item prepend-icon="mdi-note-multiple-outline" title="Notes" to="/" @click="isDrawerOpen = false" />
        <v-list-item prepend-icon="mdi-cog-outline" title="Settings" to="/settings" @click="isDrawerOpen = false" />
      </v-list>

      <v-divider class="my-2" />
      <v-list-subheader>Tags</v-list-subheader>
      <v-list density="compact" nav>
        <v-list-item title="All notes" @click="resetTagFilter" />
        <v-list-item
          v-for="tag in allTags"
          :key="tag"
          :title="`#${tag}`"
          :active="selectedTags.includes(tag)"
          @click="toggleTag(tag)"
        />
      </v-list>

      <template #append>
        <v-divider class="mb-2" />
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-information-outline" title="About" @click="aboutOpen = true" />
          <v-list-item
            v-if="authStore.user"
            prepend-icon="mdi-logout"
            title="Logout"
            @click="authStore.logout(); isDrawerOpen = false"
          />
          <v-list-item v-else prepend-icon="mdi-login" title="Login" to="/login" @click="isDrawerOpen = false" />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar density="comfortable" flat border>
      <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen" />
      <v-app-bar-title v-if="!isNotesRoute || !isSearchActive" class="font-weight-bold">Notes Manager</v-app-bar-title>
      <v-text-field
        v-else
        v-model="search"
        hide-details
        density="compact"
        variant="solo-filled"
        placeholder="Search title and text"
        prepend-inner-icon="mdi-magnify"
        class="mt-5"
      />

      <v-spacer />

      <template v-if="isNotesRoute">
        <v-btn icon="mdi-magnify" @click="toggleSearch" />
        <v-btn icon="mdi-filter-variant" @click="isFilterSheetOpen = true" />
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>

    <v-bottom-sheet v-model="isFilterSheetOpen" inset>
      <v-card>
        <v-card-title>Filters</v-card-title>
        <v-card-text>
          <v-combobox v-model="selectedTags" :items="allTags" multiple chips closable-chips label="Tags" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-bottom-sheet v-model="isTextSettingsSheetOpen" inset>
      <v-card>
        <v-card-title>Text settings</v-card-title>
        <v-card-text>
          <v-select :model-value="settingsStore.fontFamily" :items="fontOptions" label="Font family" @update:model-value="settingsStore.setFontFamily" />
          <v-slider :model-value="settingsStore.fontSizeMultiplier" min="0.9" max="1.4" step="0.05" thumb-label label="Size" @update:model-value="settingsStore.setFontSizeMultiplier" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-dialog v-model="aboutOpen" max-width="420">
      <v-card>
        <v-card-title>About</v-card-title>
        <v-card-text>PWA notes app built with Vue, Vuetify, Pinia, Router and Firebase.</v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="needRefresh" timeout="-1" location="bottom right">
      New version available.
      <template #actions>
        <v-btn color="primary" variant="text" @click="updateServiceWorker()">Update</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useAuthStore } from './stores/auth';
import { useSettingsStore } from './stores/settings';
import { useAppBar } from './composables/useAppBar';
import { useFilters } from './composables/useFilters';
import { useNotes } from './composables/useNotes';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const { isDrawerOpen, isSearchActive, isFilterSheetOpen, isTextSettingsSheetOpen } = useAppBar();
const { search, selectedTags } = useFilters();
const { allTags } = useNotes();
const aboutOpen = ref(false);

const { needRefresh, updateServiceWorker } = useRegisterSW();

const isNotesRoute = computed(() => route.name === 'notes');

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) search.value = '';
};

const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((item) => item !== tag);
  } else {
    selectedTags.value = [...selectedTags.value, tag];
  }
  router.push('/');
  isDrawerOpen.value = false;
};

const resetTagFilter = () => {
  selectedTags.value = [];
  router.push('/');
  isDrawerOpen.value = false;
};

watch(
  () => settingsStore.theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value);
  },
  { immediate: true }
);

watch(
  () => settingsStore.fontFamily,
  (v) => document.documentElement.style.setProperty('--app-font-family', v),
  { immediate: true }
);

watch(
  () => settingsStore.fontSizeMultiplier,
  (v) => document.documentElement.style.setProperty('--font-size-multiplier', String(v)),
  { immediate: true }
);

const fontOptions = [
  'Inter, system-ui, sans-serif',
  'Roboto, Arial, sans-serif',
  'Georgia, serif',
  'JetBrains Mono, monospace',
];
</script>

<style>
:root {
  --app-font-family: Inter, system-ui, sans-serif;
  --font-size-multiplier: 1;
}

.v-application {
  font-family: var(--app-font-family);
  font-size: calc(16px * var(--font-size-multiplier));
}
</style>
