import { ref } from 'vue';

const search = ref('');
const selectedTags = ref([]);

export function useFilters() {
  return { search, selectedTags };
}
