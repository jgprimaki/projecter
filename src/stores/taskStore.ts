import { defineStore } from 'pinia';

import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { useUserStore } from 'src/stores/userStore';
import { useProjectStore } from './projectStore';
import ITask from 'src/interfaces/Task';

export const useTaskStore = defineStore('task', () => {
  const userStore = useUserStore();
  const projectStore = useProjectStore();

  const addTask = (columnId: string, payload: ITask) => {
    addDoc(
      collection(
        db,
        `${userStore.currentUser}/${projectStore.currentProjectId}/columns/${columnId}/tasks`
      ),
      {
        ...payload,
        createdAt: Timestamp.fromDate(new Date()),
      }
    );
  };

  const deleteTask = (columnId: string, taskId: string) => {
    deleteDoc(
      doc(
        db,
        `${userStore.currentUser}/${projectStore.currentProjectId}/columns/${columnId}/tasks/${taskId}`
      )
    );
  };

  const updateTask = (columnId: string, taskId: string, payload: ITask) => {
    updateDoc(
      doc(
        db,
        `${userStore.currentUser}/${projectStore.currentProjectId}/columns/${columnId}/tasks/${taskId}`
      ),
      { ...payload }
    );
  };

  return {
    addTask,
    deleteTask,
    updateTask,
  };
});
