import { defineStore } from 'pinia';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    ready: false,
    loading: false,
    error: '',
    _readyPromise: null,
  }),
  actions: {
    init() {
      if (this._readyPromise) return this._readyPromise;

      this._readyPromise = new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          if (!this.ready) {
            this.ready = true;
            resolve();
          }
        });
      });

      return this._readyPromise;
    },
    async waitUntilReady() {
      if (this.ready) return;
      await this.init();
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
