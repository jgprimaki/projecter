import { defineStore } from 'pinia';
import { computed } from 'vue';
import { getAuth } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
  const currentUser = computed(() => getAuth().currentUser?.email);

  return { currentUser };
});
