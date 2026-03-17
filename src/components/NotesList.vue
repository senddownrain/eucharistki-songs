<template>
  <div>
    <div class="d-flex flex-wrap ga-3 mb-4 align-center">
      <v-btn-toggle v-model="mode" mandatory>
        <v-btn value="cards" icon="mdi-view-grid-outline" />
        <v-btn value="list" icon="mdi-format-list-bulleted" />
      </v-btn-toggle>
      <v-btn color="primary" to="/notes/new" prepend-icon="mdi-plus" :disabled="!authStore.user">New</v-btn>
      <v-spacer />
      <v-chip
        v-if="selectedTags.length"
        color="primary"
        variant="tonal"
        append-icon="mdi-close"
        @click="selectedTags = []"
      >
        Tags: {{ selectedTags.join(', ') }}
      </v-chip>
    </div>

    <v-alert v-if="!authStore.user" type="info" variant="tonal" class="mb-4">
      Login to view and manage notes.
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <div v-if="!loading && filteredNotes.length === 0" class="text-medium-emphasis text-center py-12">
      <v-icon icon="mdi-note-remove-outline" size="40" class="mb-2" />
      <div>No notes found</div>
    </div>

    <v-row v-if="mode === 'cards'" dense>
      <v-col v-for="note in filteredNotes" :key="note.id" cols="12" md="6" lg="4">
        <v-card :to="`/notes/${note.id}`" class="h-100" hover>
          <v-card-title class="d-flex align-center ga-2">
            <span class="text-truncate">{{ note.title }}</span>
            <v-icon v-if="note.pinned" icon="mdi-pin" size="18" color="primary" />
          </v-card-title>
          <v-card-text>
            <div class="text-truncate-3">{{ extractText(note.text) }}</div>
            <div class="mt-3 d-flex flex-wrap ga-1">
              <v-chip v-for="tag in note.tags || []" :key="tag" size="small" variant="tonal">#{{ tag }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-list v-else lines="three" class="bg-transparent pa-0">
      <v-list-item
        v-for="note in filteredNotes"
        :key="note.id"
        :to="`/notes/${note.id}`"
        rounded="lg"
        class="mb-2 bg-surface"
      >
        <template #prepend>
          <v-icon :icon="note.pinned ? 'mdi-pin' : 'mdi-note-text-outline'" />
        </template>
        <v-list-item-title>{{ note.title }}</v-list-item-title>
        <v-list-item-subtitle class="text-truncate-2">{{ extractText(note.text) }}</v-list-item-subtitle>
        <template #append>
          <div class="d-flex flex-wrap ga-1 justify-end">
            <v-chip v-for="tag in note.tags || []" :key="tag" size="x-small" variant="outlined">#{{ tag }}</v-chip>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useNotes } from '../composables/useNotes';
import { useAuthStore } from '../stores/auth';
import { useFilters } from '../composables/useFilters';

const authStore = useAuthStore();
const { notes, loading } = useNotes();
const { search, selectedTags } = useFilters();

const mode = ref('cards');

const extractText = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const filteredNotes = computed(() => {
  const searchLower = search.value.toLowerCase().trim();

  return notes.value.filter((note) => {
    const tagMatch =
      selectedTags.value.length === 0 ||
      (note.tags && selectedTags.value.every((tag) => note.tags.includes(tag)));

    if (!tagMatch) return false;

    if (searchLower) {
      const fullText = `${note.title || ''} ${extractText(note.text)}`.toLowerCase();
      return fullText.includes(searchLower);
    }

    return true;
  });
});
</script>

<style scoped>
.text-truncate-2,
.text-truncate-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-2 {
  -webkit-line-clamp: 2;
}

.text-truncate-3 {
  -webkit-line-clamp: 3;
}
</style>
