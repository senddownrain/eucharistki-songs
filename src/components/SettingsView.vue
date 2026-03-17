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
        :model-value="settingsStore.fontSizeMultiplier"
        label="Text size"
        min="0.9"
        max="1.4"
        step="0.05"
        thumb-label
        @update:model-value="settingsStore.setFontSizeMultiplier"
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
