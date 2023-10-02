import { defineStore } from 'pinia';
import IProject from 'src/interfaces/Project';
import IBoardColumn from 'src/interfaces/BoardColumn';
import ITask from 'src/interfaces/Task';

import { ref, computed } from 'vue';
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { useUserStore } from 'src/stores/userStore';

export const useProjectStore = defineStore('project', () => {
  const userStore = useUserStore();

  const projects = ref<IProject[]>([]);
  const currentProjectId = ref('');
  let unsubscribers: Unsubscribe[] = [];

  const currentProject = computed(() => {
    return projects.value.find(
      (project) => project.id === currentProjectId.value
    );
  });

  const currentProjectColumns = computed(() => currentProject.value?.columns);

  const currentProjectColumnsAmount = computed(
    () => currentProject.value?.columns?.length
  );

  const projectsAmount = computed(() => projects.value?.length);

  const setCurrentProjectId = (projectId: string) =>
    (currentProjectId.value = projectId);

  const subscribeToTasks = (
    userEmail: string,
    projectId: string,
    columnId: string
  ) => {
    const unsubscriber = onSnapshot(
      query(
        collection(db, `${userEmail}/${projectId}/columns/${columnId}/tasks`),
        orderBy('createdAt')
      ),
      (taskQuerySnapshot) => {
        const project = projects.value.find(
          (project) => project.id === projectId
        );

        if (project) {
          const column = project.columns?.find(
            (column) => column.id === columnId
          );

          if (column) {
            column.tasks = [];
            taskQuerySnapshot.forEach((task) => {
              column.tasks.push({
                ...(task.data() as ITask),
                id: task.id,
              });
            });
          }
        }
      }
    );

    unsubscribers.push(unsubscriber);
  };

  const subscribeToColumns = (userEmail: string, projectId: string) => {
    const unsubscriber = onSnapshot(
      query(
        collection(db, `${userEmail}/${projectId}/columns`),
        orderBy('createdAt')
      ),
      (columnQuerySnapshot) => {
        const project = projects.value.find(
          (project) => project.id === projectId
        );
        if (project) {
          project.columns = [];

          columnQuerySnapshot.forEach((column) => {
            project.columns?.push({
              ...(column.data() as IBoardColumn),
              id: column.id,
            });

            subscribeToTasks(userEmail, projectId, column.id);
          });
        }
      }
    );

    unsubscribers.push(unsubscriber);
  };

  const subscribeToProjects = (userEmail: string) => {
    unsubscribeAll();
    projects.value = [];
    const unsubscriber = onSnapshot(
      query(collection(db, `${userEmail}`), orderBy('createdAt')),
      (projectQuerySnapshot) => {
        projects.value = [];

        projectQuerySnapshot.forEach((doc) => {
          projects.value.push({ ...(doc.data() as IProject), id: doc.id });

          subscribeToColumns(userEmail, doc.id);
        });
      }
    );

    unsubscribers.push(unsubscriber);
  };

  const addProject = (payload: IProject) => {
    const localPayload = {
      ...payload,
      createdAt: Timestamp.fromDate(new Date()),
    };

    addDoc(collection(db, `${userStore.currentUser}`), localPayload);
  };

  const updateProject = (id: string, payload: IProject) => {
    updateDoc(doc(db, `${userStore.currentUser}/${id}`), { ...payload });
  };

  const deleteProject = (id: string) => {
    deleteDoc(doc(db, `${userStore.currentUser}/${id}`));
  };

  const unsubscribeAll = () => {
    if (unsubscribers?.length)
      unsubscribers.forEach((unsubscriber) => unsubscriber());

    unsubscribers = [];
  };

  return {
    projects,
    currentProjectId,
    currentProjectColumns,
    currentProjectColumnsAmount,
    projectsAmount,
    addProject,
    updateProject,
    deleteProject,
    subscribeToProjects,
    setCurrentProjectId,
  };
});
