import { defineStore } from 'pinia';

import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { useUserStore } from 'src/stores/userStore';
import { useProjectStore } from './projectStore';
import IBoardColumn from 'src/interfaces/BoardColumn';

export const useColumnStore = defineStore('column', () => {
  const userStore = useUserStore();
  const projectStore = useProjectStore();

  const deleteColumn = (columnId: string) => {
    deleteDoc(
      doc(
        db,
        `${userStore.currentUser}/${projectStore.currentProjectId}/columns/${columnId}`
      )
    );
  };

  const updateColumn = (columnId: string, payload: IBoardColumn) => {
    updateDoc(
      doc(
        db,
        `${userStore.currentUser}`,
        `${projectStore.currentProjectId}`,
        'columns',
        `${columnId}`
      ),
      { ...payload }
    );
  };

  return {
    deleteColumn,
    updateColumn,
  };
});
