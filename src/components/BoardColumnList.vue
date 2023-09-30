<template>
  <section :class="$style['board-column']">
    <section :class="$style['board-column__list']">
      <BoardColumn
        v-for="column in projectStore.currentProjectColumns"
        :key="column.id"
        :board-column="column"
      />
    </section>
    <q-btn
      :class="$style['board-column__add']"
      @click="addColumn"
      v-if="showAddButton"
      color="primary"
      icon="add"
    >
      {{ $t('boardColumnList.actions.addNewColumn') }}
    </q-btn>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import BoardColumn from 'src/components/BoardColumn.vue';
import { useProjectStore } from 'src/stores/projectStore';
import { useUserStore } from 'src/stores/userStore';
import { useI18n } from 'vue-i18n';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from 'src/boot/firebase';

const userStore = useUserStore();
const projectStore = useProjectStore();
const { t } = useI18n();

const addColumn = () => {
  addDoc(
    collection(
      db,
      `${userStore.currentUser}`,
      `${projectStore.currentProjectId}`,
      'columns'
    ),
    {
      title: t('boardColumnList.actions.clickToUpdate'),
      createdAt: Timestamp.fromDate(new Date()),
    }
  );
};

const showAddButton = computed(
  () => projectStore.currentProjectColumns?.length < 5
);
</script>

<style lang="scss" module>
.board-column {
  @apply flex gap-3 h-[50%];

  &__list {
    @apply flex flex-row gap-3;
  }

  &__add {
    @apply h-3 bg-neutral-700;
  }
}
</style>
src/stores/userStore
