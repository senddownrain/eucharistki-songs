import { defineStore } from 'pinia';

const STORAGE_KEY = 'notes-manager-settings';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizeMultiplier: 1,
  }),
  actions: {
    init() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.theme = parsed.theme || this.theme;
      this.fontFamily = parsed.fontFamily || this.fontFamily;
      this.fontSizeMultiplier = parsed.fontSizeMultiplier || parsed.fontSize / 16 || this.fontSizeMultiplier;
    },
    save() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: this.theme,
          fontFamily: this.fontFamily,
          fontSizeMultiplier: this.fontSizeMultiplier,
        })
      );
    },
    setTheme(theme) {
      this.theme = theme;
      this.save();
    },
    setFontFamily(fontFamily) {
      this.fontFamily = fontFamily;
      this.save();
    },
    setFontSizeMultiplier(fontSizeMultiplier) {
      this.fontSizeMultiplier = Number(fontSizeMultiplier);
      this.save();
    },
  },
});
