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
import ITask from 'src/interfaces/Task';

export const useTaskStore = defineStore('task', () => {
  const userStore = useUserStore();

  const addTask = (projectId: string, columnId: string, payload: ITask) => {
    addDoc(
      collection(
        db,
        `${userStore.currentUser}/${projectId}/columns/${columnId}/tasks`
      ),
      {
        ...payload,
        createdAt: Timestamp.fromDate(new Date()),
      }
    );
  };

  const deleteTask = (projectId: string, columnId: string, taskId: string) => {
    deleteDoc(
      doc(
        db,
        `${userStore.currentUser}/${projectId}/columns/${columnId}/tasks/${taskId}`
      )
    );
  };

  const updateTask = (
    projectId: string,
    columnId: string,
    taskId: string,
    payload: ITask
  ) => {
    updateDoc(
      doc(
        db,
        `${userStore.currentUser}/${projectId}/columns/${columnId}/tasks/${taskId}`
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
