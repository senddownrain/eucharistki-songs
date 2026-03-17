import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import NotesList from '../components/NotesList.vue';
import NoteView from '../components/NoteView.vue';
import NoteForm from '../components/NoteForm.vue';
import SettingsView from '../components/SettingsView.vue';
import LoginView from '../components/LoginView.vue';

const routes = [
  { path: '/', name: 'notes', component: NotesList },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/notes/new', name: 'note-create', component: NoteForm, meta: { requiresAuth: true } },
  { path: '/notes/:id', name: 'note-view', component: NoteView },
  { path: '/notes/:id/edit', name: 'note-edit', component: NoteForm, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.waitUntilReady();

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
