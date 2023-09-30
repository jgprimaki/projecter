<template>
  <q-card :class="$style['task']">
    <q-card-section :class="$style['task__title']">
      <span class="overflow-ellipsis overflow-hidden"
        >{{ task.title }}
        <q-tooltip class="text-body2"> {{ task.title }} </q-tooltip></span
      >

      <section :class="$style['task__title__actions']">
        <q-btn
          round
          color="primary"
          icon="edit"
          dense
          size="sm"
          :class="$style['task__actions']"
          @click="updateTask"
          ><q-tooltip class="text-body2">
            {{ $t('taskCard.actions.updateTask') }}
          </q-tooltip>
        </q-btn>
        <q-btn
          round
          color="negative"
          icon="delete"
          dense
          size="sm"
          :class="$style['task__actions']"
          @click="deleteTask"
          ><q-tooltip class="text-body2">
            {{ $t('taskCard.actions.deleteTask') }}
          </q-tooltip>
        </q-btn>
      </section>
    </q-card-section>
    <q-card-section>
      <q-icon name="person" size="sm" :color="assigneeColor"
        ><q-tooltip class="text-body2"> {{ assignee }} </q-tooltip>
      </q-icon>
    </q-card-section>
  </q-card>

  <TaskManagerModal
    :open="taskManagerModalVisibility"
    :task="task"
    :column-id="columnId"
    @close="changeModalVisibilty(false)"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ITask from 'src/interfaces/Task';
import { useProjectStore } from 'src/stores/projectStore';
import { useTaskStore } from 'src/stores/taskStore';
import TaskManagerModal from 'src/components/TaskManagerModal.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ task: ITask; columnId: string }>();

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const { t } = useI18n();

const taskManagerModalVisibility = ref(false);

const changeModalVisibilty = (visible: boolean) => {
  taskManagerModalVisibility.value = visible;
};

const updateTask = () => {
  changeModalVisibilty(true);
};

const deleteTask = () => {
  taskStore.deleteTask(
    projectStore.currentProjectId ?? '',
    props.columnId,
    props.task.id ?? ''
  );
};

const assignee = computed(() =>
  t(`taskCard.${props.task.assignee ? 'assignee' : 'emptyAssignee'}`, [
    props.task.assignee,
  ])
);

const assigneeColor = computed(() => (props.task.assignee ? 'primary' : ''));
</script>

<style lang="scss" scoped module>
.task {
  &:hover {
    --delete--task: 100%;
  }

  &__title {
    @apply flex items-center justify-between gap-1;

    &__actions {
      @apply flex gap-2;
    }
  }

  &__actions {
    opacity: var(--delete--task, 0);
  }
}
</style>
