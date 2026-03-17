<template>
  <v-card>
    <v-card-title>Settings</v-card-title>
    <v-card-text>
      <v-select
        :model-value="settingsStore.theme"
        label="Theme"
        :items="['light', 'dark']"
        @update:model-value="settingsStore.setTheme"
      />

      <v-select
        :model-value="settingsStore.fontFamily"
        label="Font family"
        :items="fontOptions"
        @update:model-value="settingsStore.setFontFamily"
      />

      <v-slider
        :model-value="settingsStore.fontSize"
        label="Text size"
        min="12"
        max="22"
        step="1"
        thumb-label
        @update:model-value="settingsStore.setFontSize"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useSettingsStore } from '../stores/settings';

const settingsStore = useSettingsStore();

const fontOptions = [
  'Inter, system-ui, sans-serif',
  'Roboto, Arial, sans-serif',
  'Georgia, serif',
  'JetBrains Mono, monospace',
];
</script>
