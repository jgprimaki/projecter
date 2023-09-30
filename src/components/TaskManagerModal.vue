<template>
  <q-dialog v-model="visibility">
    <q-card>
      <q-card-section>
        <span :class="$style['title']">{{ description }}</span>
      </q-card-section>
      <q-card-section :class="$style['field']">
        <q-form greedy class="flex flex-col gap-2" @submit="executeAction">
          <q-input
            filled
            v-model="form.title"
            :label="$t('taskManagerModal.fields.title')"
            :rules="[
              (val) =>
                val.length > 0 || $t('taskManagerModal.rules.requiredField'),
            ]"
            :maxlength="30"
            autofocus
          />
          <q-select
            filled
            v-model="form.assignee"
            :label="$t('taskManagerModal.fields.assignee')"
            :options="options"
          />

          <q-separator />

          <q-card-actions align="right">
            <q-btn :label="$t('general.close')" v-close-popup />
            <q-btn :label="description" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, defineEmits, reactive, watch } from 'vue';
import { useProjectStore } from 'src/stores/projectStore';
import { useTaskStore } from 'src/stores/taskStore';
import ITask from 'src/interfaces/Task';
import { useI18n } from 'vue-i18n';

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const { t } = useI18n();

const props = defineProps<{
  open: boolean;
  columnId: string;
  task?: ITask;
}>();

const emit = defineEmits(['close']);

let form = reactive({
  title: '',
  assignee: '',
});

const options = ['Jackson', 'Trevis', 'Jonathan', 'Manoela', 'Laides'];

const clearForm = () => {
  form.title = '';
  form.assignee = '';
};

const addTask = () => {
  taskStore.addTask(projectStore.currentProjectId ?? '', props.columnId, form);
};

const updateTask = () => {
  taskStore.updateTask(
    projectStore.currentProjectId ?? '',
    props.columnId,
    props.task?.id ?? '',
    form
  );
};

const executeAction = () => {
  if (taskExists.value) updateTask();
  else addTask();

  emit('close');
};

const visibility = computed({
  get() {
    return props.open;
  },
  set(newValue) {
    emit('close', newValue);
  },
});

const taskExists = computed(() => {
  return props.task?.id;
});

const description = computed(() =>
  !taskExists.value
    ? t('taskManagerModal.newTask')
    : t('taskManagerModal.updateTask')
);

watch(
  () => props.open,
  () => {
    clearForm();

    form.title = props.task?.title || '';
    form.assignee = props.task?.assignee || '';
  }
);
</script>

<style lang="scss" module>
.title {
  @apply font-bold text-xl;
}

.field {
  @apply flex flex-col gap-3 min-w-[450px];
}
</style>
