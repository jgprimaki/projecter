<template>
  <q-card :class="$style.board">
    <q-card-section
      v-if="!isEditing"
      :class="$style['board__title']"
      @click="editField(true)"
    >
      <section :class="$style['header']">
        <section :class="$style['board__title__content']">
          {{ boardColumn.title }}

          <span v-if="boardColumn.tasks?.length"
            >({{ boardColumn.tasks?.length }})</span
          >
        </section>

        <q-btn
          round
          color="negative"
          icon="delete"
          dense
          size="xs"
          v-if="showDeleteColumnButton"
          :class="$style['board__title__delete-column']"
          @click="deleteColumn"
          ><q-tooltip class="text-body2">
            {{ $t('boardColumn.actions.deleteColumn') }}
          </q-tooltip>
        </q-btn>
      </section>
    </q-card-section>

    <q-input
      v-else
      v-model="editingValue"
      standout
      filled
      dense
      :value="boardColumn.title"
      @blur="saveField"
      @keyup.enter="$event.target.blur()"
      autofocus
      :maxlength="25"
    />

    <section :class="$style['board__projects']">
      <TaskCard
        v-for="task in boardColumn.tasks"
        :key="task.id"
        :column-id="boardColumn.id"
        :task="task"
      />

      <q-btn
        icon="add"
        :class="$style['board__add-project']"
        color="primary"
        @click="newTask"
        >{{ $t('boardColumn.actions.newTask') }}</q-btn
      >
    </section>
  </q-card>

  <TaskManagerModal
    :open="taskManagerModalVisibility"
    :column-id="boardColumn.id"
    @close="changeModalVisibilty(false)"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TaskCard from 'src/components/TaskCard.vue';
import IBoardColumn from 'src/interfaces/BoardColumn';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from 'src/stores/projectStore';
import { useColumnStore } from 'src/stores/columnStore';
import { useQuasar } from 'quasar';
import TaskManagerModal from 'src/components/TaskManagerModal.vue';

const props = defineProps<{
  boardColumn: IBoardColumn;
}>();

const isEditing = ref(false);
const editingValue = ref('');
const TASKS_MAXIMUM_AMOUNT = 5;
const taskManagerModalVisibility = ref(false);
const projectStore = useProjectStore();
const columnStore = useColumnStore();
const $q = useQuasar();
const { t } = useI18n();

const changeModalVisibilty = (visible: boolean) => {
  taskManagerModalVisibility.value = visible;
};

const editField = (edit: boolean) => {
  isEditing.value = edit;

  if (edit) editingValue.value = props.boardColumn.title;
};

const saveField = () => {
  if (editingValue.value && editingValue.value !== props.boardColumn.title)
    columnStore.updateColumn(props.boardColumn.id, {
      title: editingValue.value,
    } as IBoardColumn);

  editField(false);
};

const newTask = () => {
  if (props.boardColumn.tasks.length >= TASKS_MAXIMUM_AMOUNT)
    return $q.notify({
      type: 'warning',
      message: t('boardColumn.messages.newTaskLimit', [TASKS_MAXIMUM_AMOUNT]),
      position: 'top',
    });

  changeModalVisibilty(true);
};

const deleteColumn = () => columnStore.deleteColumn(props.boardColumn.id);

const showDeleteColumnButton = computed(() => {
  return (projectStore.currentProjectColumnsAmount ?? 0) > 1;
});
</script>

<style lang="scss" module>
.board {
  @apply w-60 h-full bg-neutral-700;

  .header {
    @apply flex items-center justify-between gap-2;
  }

  &:hover {
    --display-add-project: 100%;
  }

  &__title {
    @apply uppercase font-bold p-2;

    &__content {
      @apply px-1 rounded-lg w-full cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap;
    }

    &__content:hover {
      background-color: var(--q-dark);
    }

    &__delete-column {
      opacity: var(--display-add-project, 0);
    }
  }

  &__projects {
    @apply flex flex-col gap-2 p-2;
  }

  &__add-project {
    opacity: var(--display-add-project, 0);
  }
}
</style>
