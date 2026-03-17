<template>
  <div>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/" class="mb-4">Back</v-btn>

    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <v-alert v-else-if="!note" type="warning" variant="tonal">Note not found.</v-alert>

    <v-card v-else>
      <v-card-title class="d-flex align-center ga-2">
        <span>{{ note.title }}</span>
        <v-icon v-if="note.pinned" icon="mdi-pin" color="primary" />
      </v-card-title>
      <v-card-subtitle>
        Updated: {{ formatDate(note.updatedAt) }}
      </v-card-subtitle>
      <v-card-text>
        <p class="text-pre-wrap">{{ note.text }}</p>
        <div class="d-flex flex-wrap ga-2 mt-4">
          <v-chip v-for="tag in note.tags || []" :key="tag" variant="tonal">#{{ tag }}</v-chip>
        </div>
      </v-card-text>
      <v-card-actions v-if="canManage">
        <v-btn color="primary" :to="`/notes/${note.id}/edit`" prepend-icon="mdi-pencil">Edit</v-btn>
        <v-btn color="error" variant="outlined" prepend-icon="mdi-delete" @click="confirmDelete = true">Delete</v-btn>
      </v-card-actions>
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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { getNoteById, removeNote } = useNotes();

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

const formatDate = (ts) => {
  if (!ts?.toDate) return 'n/a';
  return ts.toDate().toLocaleString();
};

onMounted(load);
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
