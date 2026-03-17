import { ref } from 'vue';

const isDrawerOpen = ref(false);
const isSearchActive = ref(false);
const isFilterSheetOpen = ref(false);
const isTextSettingsSheetOpen = ref(false);

export function useAppBar() {
  return { isDrawerOpen, isSearchActive, isFilterSheetOpen, isTextSettingsSheetOpen };
}
