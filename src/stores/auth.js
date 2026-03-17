import { defineStore } from 'pinia';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    ready: false,
    loading: false,
    error: '',
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.ready = true;
      });
    },
    async login(email, password) {
      this.loading = true;
      this.error = '';
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await signOut(auth);
    },
  },
});
