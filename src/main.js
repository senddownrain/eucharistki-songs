import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { useSettingsStore } from './stores/settings';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

settingsStore.init();
authStore.init();

app.mount('#app');
