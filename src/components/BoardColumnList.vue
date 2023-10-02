<template>
  <section class="h-full w-full">
    <q-btn class="mb-4" @click="returnRoute" round color="primary" icon="west">
      <q-tooltip class="text-body2">{{ $t('general.return') }}</q-tooltip>
    </q-btn>
    <q-scroll-area
      style="height: 80vh; width: 100%"
      :content-style="scrollAreaStyle"
      :content-active-style="scrollAreaStyle"
    >
      <BoardColumn
        v-for="column in projectStore.currentProjectColumns"
        :key="column.id"
        :board-column="column"
      />

      <q-btn
        :class="$style['board-column__add']"
        @click="addColumn"
        v-if="showAddButton"
        color="primary"
        icon="add"
        :round="addButtonRound"
      >
        <q-tooltip v-if="addButtonRound" class="text-body2">
          {{ $t('boardColumnList.actions.addNewColumn') }}</q-tooltip
        >
        <span v-else>{{ $t('boardColumnList.actions.addNewColumn') }}</span>
      </q-btn>
    </q-scroll-area>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue';
import BoardColumn from 'src/components/BoardColumn.vue';
import { useProjectStore } from 'src/stores/projectStore';
import { useUserStore } from 'src/stores/userStore';
import { useI18n } from 'vue-i18n';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { useQuasar } from 'quasar';
const $q = useQuasar();

const userStore = useUserStore();
const projectStore = useProjectStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const COLUMN_MAXIMUM_AMOUNT = 5;

const scrollAreaStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.75rem',
};

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

const returnRoute = () => router.go(-1);

const showAddButton = computed(
  () => projectStore.currentProjectColumns?.length < COLUMN_MAXIMUM_AMOUNT
);

const routeProjectId = computed(() => route.params?.id);

const addButtonRound = computed(() => $q.screen.lt.lg);

watch(routeProjectId, (id) => projectStore.setCurrentProjectId(id), {
  immediate: true,
});
</script>

<style lang="scss" module>
.board-column {
  &__add {
    @apply h-3;
  }
}
</style>
