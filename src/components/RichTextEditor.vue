<template>
  <div class="editor-wrap">
    <div class="toolbar d-flex flex-wrap ga-1 mb-2">
      <v-btn size="small" variant="text" icon="mdi-format-bold" @click="cmd('bold')" />
      <v-btn size="small" variant="text" icon="mdi-format-italic" @click="cmd('italic')" />
      <v-btn size="small" variant="text" icon="mdi-format-header-1" @click="cmd('formatBlock', 'h1')" />
      <v-btn size="small" variant="text" icon="mdi-format-list-bulleted" @click="cmd('insertUnorderedList')" />
      <v-btn size="small" variant="text" icon="mdi-format-list-numbered" @click="cmd('insertOrderedList')" />
      <v-btn size="small" variant="text" icon="mdi-format-align-left" @click="cmd('justifyLeft')" />
      <v-btn size="small" variant="text" icon="mdi-format-align-center" @click="cmd('justifyCenter')" />
      <v-btn size="small" variant="text" icon="mdi-format-align-right" @click="cmd('justifyRight')" />
      <v-btn size="small" variant="text" icon="mdi-link-variant" @click="setLink" />
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" size="small" variant="text" icon="mdi-palette" />
        </template>
        <v-list density="compact">
          <v-list-item v-for="item in colors" :key="item.value" @click="cmd('foreColor', item.value)">
            <template #prepend><span class="color-dot" :style="{ background: item.value }" /></template>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div
      ref="editable"
      class="editor-content"
      contenteditable="true"
      @input="emitValue"
      @blur="emitValue"
      v-html="innerHtml"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ modelValue: { type: String, default: '' } });
const emit = defineEmits(['update:modelValue']);

const editable = ref(null);
const innerHtml = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    if (value !== innerHtml.value) innerHtml.value = value;
  }
);

const emitValue = () => {
  innerHtml.value = editable.value?.innerHTML || '';
  emit('update:modelValue', innerHtml.value);
};

const cmd = (name, value = null) => {
  editable.value?.focus();
  document.execCommand(name, false, value);
  emitValue();
};

const setLink = () => {
  const url = window.prompt('URL');
  if (!url) return;
  cmd('createLink', url);
};

const colors = [
  { name: 'Default', value: '#111827' },
  { name: 'Primary', value: '#1976d2' },
  { name: 'Danger', value: '#b00020' },
  { name: 'Success', value: '#2e7d32' },
];
</script>

<style scoped>
.editor-content {
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 8px;
  padding: 12px;
  min-height: 220px;
  outline: none;
}
.color-dot { width: 12px; height: 12px; border-radius: 50%; }
</style>
