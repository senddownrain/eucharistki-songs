<template>
  <div>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/" class="mb-4">Back</v-btn>
    <v-card>
      <v-card-title>{{ isEdit ? 'Edit note' : 'Create note' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.title"
            label="Title"
            :rules="[(v) => !!v || 'Title is required']"
            required
          />
          <v-textarea
            v-model="form.text"
            label="Text"
            :rules="[(v) => !!v || 'Text is required']"
            rows="8"
            auto-grow
            required
          />
          <v-combobox
            v-model="form.tags"
            label="Tags"
            multiple
            chips
            closable-chips
            clearable
            hint="Press Enter to add tag"
            persistent-hint
          />
          <div class="d-flex ga-6">
            <v-switch v-model="form.pinned" label="Pinned" />
            <v-switch v-model="form.hidden" label="Hidden" />
          </div>

          <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

          <v-btn type="submit" color="primary" :loading="saving">
            {{ isEdit ? 'Save changes' : 'Create note' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotes } from '../composables/useNotes';

const route = useRoute();
const router = useRouter();
const { createNote, editNote, getNoteById } = useNotes();

const isEdit = computed(() => Boolean(route.params.id));
const formRef = ref(null);
const saving = ref(false);
const error = ref('');
const form = ref({
  title: '',
  text: '',
  tags: [],
  pinned: false,
  hidden: false,
});

const load = async () => {
  if (!isEdit.value) return;
  const note = await getNoteById(route.params.id);
  if (!note) {
    router.push('/');
    return;
  }
  form.value = {
    title: note.title,
    text: note.text,
    tags: note.tags || [],
    pinned: Boolean(note.pinned),
    hidden: Boolean(note.hidden),
  };
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  saving.value = true;
  error.value = '';

  const payload = {
    ...form.value,
    tags: form.value.tags.map((t) => t.trim()).filter(Boolean),
  };

  try {
    if (isEdit.value) {
      await editNote(route.params.id, payload);
      router.push(`/notes/${route.params.id}`);
    } else {
      const refDoc = await createNote(payload);
      router.push(`/notes/${refDoc.id}`);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

onMounted(load);
</script>
