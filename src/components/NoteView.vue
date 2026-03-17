<template>
  <div>
    <v-app-bar flat class="rounded-lg mb-4" border>
      <v-btn icon="mdi-arrow-left" variant="text" to="/" />
      <v-app-bar-title class="text-truncate">{{ note?.title || 'Note' }}</v-app-bar-title>
      <v-menu location="bottom end" transition="slide-y-transition" v-if="note">
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props" />
        </template>
        <v-list density="compact" class="pa-0">
          <v-list-item prepend-icon="mdi-share-variant-outline" title="Share" @click="shareCurrentNote" />
          <v-list-item
            :prepend-icon="note?.pinned ? 'mdi-pin-off-outline' : 'mdi-pin-outline'"
            :title="note?.pinned ? 'Unpin' : 'Pin'"
            @click="togglePinned"
          />
          <v-list-item prepend-icon="mdi-format-font" title="Text settings" @click="isTextSettingsSheetOpen = true" />
          <v-list-item v-if="canManage" prepend-icon="mdi-pencil" title="Edit" @click="router.push(`/notes/${note.id}/edit`)" />
          <v-list-item v-if="canManage" prepend-icon="mdi-delete" title="Delete" @click="confirmDelete = true" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-progress-linear v-if="loading" indeterminate class="mb-4" />
    <v-alert v-else-if="!note" type="warning" variant="tonal">Note not found.</v-alert>

    <v-card v-else class="pa-4 pa-md-6">
      <h1 class="text-h5 text-md-h4 mb-2">{{ note.title }}</h1>
      <div class="text-caption text-medium-emphasis mb-6">Updated: {{ formatDate(note.updatedAt) }}</div>

      <div class="note-content" v-html="note.text" />

      <div class="d-flex flex-wrap ga-2 mt-6">
        <v-chip v-for="tag in note.tags || []" :key="tag" variant="tonal">#{{ tag }}</v-chip>
      </div>
    </v-card>

    <v-dialog v-model="confirmDelete" max-width="420">
      <v-card>
        <v-card-title>Delete note?</v-card-title>
        <v-card-text>This action cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn color="error" @click="handleDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotes } from '../composables/useNotes';
import { useAuthStore } from '../stores/auth';
import { useAppBar } from '../composables/useAppBar';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { getNoteById, removeNote, editNote } = useNotes();
const { isTextSettingsSheetOpen } = useAppBar();

const note = ref(null);
const loading = ref(true);
const confirmDelete = ref(false);

const canManage = computed(() => authStore.user && authStore.user.uid === note.value?.ownerId);

const load = async () => {
  loading.value = true;
  note.value = await getNoteById(route.params.id);
  loading.value = false;
};

const handleDelete = async () => {
  await removeNote(route.params.id);
  confirmDelete.value = false;
  router.push('/');
};

const togglePinned = async () => {
  if (!note.value || !canManage.value) return;
  const nextPinned = !note.value.pinned;
  await editNote(note.value.id, {
    title: note.value.title,
    text: note.value.text,
    tags: note.value.tags || [],
    pinned: nextPinned,
  });
  note.value.pinned = nextPinned;
};

const shareCurrentNote = async () => {
  if (!note.value) return;
  const shareText = `${note.value.title}\n\n${(note.value.text || '').replace(/<[^>]*>/g, ' ')}`;
  if (navigator.share) {
    await navigator.share({ title: note.value.title, text: shareText });
    return;
  }
  await navigator.clipboard.writeText(shareText);
};

const formatDate = (ts) => {
  if (!ts?.toDate) return 'n/a';
  return ts.toDate().toLocaleString();
};

onMounted(load);
</script>

<style scoped>
.note-content {
  line-height: 1.75;
  font-size: calc(1rem * var(--font-size-multiplier));
}

.note-content :deep(h1),
.note-content :deep(h2),
.note-content :deep(h3) {
  margin-top: 1.2em;
  margin-bottom: 0.4em;
}
</style>
