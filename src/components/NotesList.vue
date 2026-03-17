<template>
  <div>
    <div class="d-flex flex-wrap ga-3 mb-4 align-center">
      <v-text-field
        v-model="search"
        hide-details
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        label="Search notes"
        class="flex-grow-1"
      />
      <v-select
        v-model="selectedTags"
        :items="allTags"
        label="Filter tags"
        multiple
        chips
        closable-chips
        hide-details
        density="comfortable"
        style="max-width: 320px"
      />
      <v-btn-toggle v-model="mode" mandatory>
        <v-btn value="cards" icon="mdi-view-grid-outline" />
        <v-btn value="list" icon="mdi-format-list-bulleted" />
      </v-btn-toggle>
      <v-btn color="primary" to="/notes/new" prepend-icon="mdi-plus" :disabled="!authStore.user">New</v-btn>
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
            <div class="text-truncate-3">{{ note.text }}</div>
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
        <v-list-item-subtitle class="text-truncate-2">{{ note.text }}</v-list-item-subtitle>
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

const authStore = useAuthStore();
const { notes, loading, allTags } = useNotes();

const search = ref('');
const selectedTags = ref([]);
const mode = ref('cards');

const filteredNotes = computed(() => {
  const query = search.value.trim().toLowerCase();
  return notes.value.filter((note) => {
    if (note.hidden) return false;
    const inSearch =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.text.toLowerCase().includes(query);
    const inTags =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((tag) => (note.tags || []).includes(tag));
    return inSearch && inTags;
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
