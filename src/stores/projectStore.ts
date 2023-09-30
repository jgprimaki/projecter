import { defineStore } from 'pinia';
import IProject from 'src/interfaces/Project';
import IBoardColumn from 'src/interfaces/BoardColumn';
import ITask from 'src/interfaces/Task';

import { ref, computed, onMounted } from 'vue';
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
import { useRoute } from 'vue-router';

export const useProjectStore = defineStore('project', () => {
  const userStore = useUserStore();

  const projects = ref<IProject[]>([]);

  const currentProject = computed(() =>
    projects.value.find((project) => project.id === useRoute().params?.id)
  );

  const currentProjectId = computed(() => currentProject.value?.id);

  const currentProjectColumns = computed(() => currentProject.value?.columns);

  const currentProjectColumnsAmount = computed(
    () => currentProject.value?.columns?.length
  );

  let projectSubscriber: Unsubscribe;

  const subscribeToTasks = (
    userEmail: string,
    projectId: string,
    columnId: string
  ) => {
    onSnapshot(
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
  };

  const subscribeToColumns = (userEmail: string, projectId: string) => {
    onSnapshot(
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
  };

  const subscribeToProjects = (userEmail: string) => {
    projectSubscriber = onSnapshot(
      query(collection(db, `${userEmail}`), orderBy('createdAt')),
      (projectQuerySnapshot) => {
        projects.value = [];

        projectQuerySnapshot.forEach((doc) => {
          projects.value.push({ ...(doc.data() as IProject), id: doc.id });

          subscribeToColumns(userEmail, doc.id);
        });
      }
    );
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

  const deleteColumn = (projectId: string, columnId: string) => {
    deleteDoc(
      doc(db, `${userStore.currentUser}/${projectId}/columns/${columnId}`)
    );
  };

  onMounted(() => {
    if (projectSubscriber) projectSubscriber();
  });

  return {
    projects,
    currentProjectId,
    currentProjectColumns,
    currentProjectColumnsAmount,
    addProject,
    updateProject,
    deleteProject,
    deleteColumn,
    subscribeToProjects,
  };
});
