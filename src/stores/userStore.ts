import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useProjectStore } from './projectStore';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<string | null | undefined>(null);
  const projectStore = useProjectStore();

  onAuthStateChanged(getAuth(), (user) => {
    currentUser.value = user?.email;

    if (currentUser.value) projectStore.subscribeToProjects(currentUser.value);
  });

  return { currentUser };
});
