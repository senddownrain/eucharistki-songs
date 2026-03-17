import { computed, ref, watch } from 'vue';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../stores/auth';

export function useNotes() {
  const authStore = useAuthStore();
  const notes = ref([]);
  const loading = ref(false);
  const error = ref('');

  let unsubscribe = null;

  const bindNotes = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    if (!authStore.user) {
      notes.value = [];
      return;
    }

    loading.value = true;
    const notesQuery = query(
      collection(db, 'notes'),
      where('ownerId', '==', authStore.user.uid),
      orderBy('pinned', 'desc'),
      orderBy('updatedAt', 'desc')
    );

    unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        notes.value = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        loading.value = false;
      },
      (err) => {
        error.value = err.message;
        loading.value = false;
      }
    );
  };

  watch(
    () => authStore.user?.uid,
    () => bindNotes(),
    { immediate: true }
  );

  const allTags = computed(() => {
    const set = new Set();
    notes.value.forEach((note) => (note.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  const createNote = async (payload) => {
    if (!authStore.user) throw new Error('Authentication required');
    return addDoc(collection(db, 'notes'), {
      title: payload.title,
      text: payload.text,
      tags: payload.tags || [],
      pinned: Boolean(payload.pinned),
      ownerId: authStore.user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const editNote = async (id, payload) => {
    if (!authStore.user) throw new Error('Authentication required');
    const refDoc = doc(db, 'notes', id);
    await updateDoc(refDoc, {
      title: payload.title,
      text: payload.text,
      tags: payload.tags || [],
      pinned: Boolean(payload.pinned),
      updatedAt: serverTimestamp(),
    });
  };

  const removeNote = async (id) => {
    if (!authStore.user) throw new Error('Authentication required');
    await deleteDoc(doc(db, 'notes', id));
  };

  const getNoteById = async (id) => {
    const snapshot = await getDoc(doc(db, 'notes', id));
    if (!snapshot.exists()) return null;

    const note = { id: snapshot.id, ...snapshot.data() };
    if (!authStore.user || note.ownerId !== authStore.user.uid) return null;

    return note;
  };

  return { notes, loading, error, allTags, createNote, editNote, removeNote, getNoteById };
}
