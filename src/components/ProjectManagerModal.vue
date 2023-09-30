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
            v-model="form.name"
            :label="$t('projectManagerModal.fields.name')"
            :rules="[
              (val) =>
                val.length > 0 || $t('projectManagerModal.rules.requiredField'),
            ]"
            :maxlength="30"
            autofocus
          />
          <q-input
            filled
            v-model="form.description"
            :label="$t('projectManagerModal.fields.description')"
            :maxlength="50"
          />
          <q-select
            filled
            v-model="form.responsible"
            :label="$t('projectManagerModal.fields.responsible')"
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
import IProject from 'src/interfaces/Project';
import { useI18n } from 'vue-i18n';

const projectStore = useProjectStore();
const { t } = useI18n();

const props = defineProps<{
  open: boolean;
  project?: IProject;
}>();

const emit = defineEmits(['close']);

let form = reactive({
  name: '',
  description: '',
  responsible: '',
});

const options = ['João', 'Maria', 'José', 'Lúcia', 'Celso'];

const clearForm = () => {
  form.name = '';
  form.description = '';
  form.responsible = '';
};

const addProject = () => {
  projectStore.addProject(form);
};

const updateProject = () => {
  projectStore.updateProject(props.project?.id ?? '', form);
};

const executeAction = () => {
  if (projectExists.value) updateProject();
  else addProject();

  emit('close');
};

const visibility = computed({
  get() {
    return props.open;
  },
  set() {
    emit('close');
  },
});

const projectExists = computed(() => {
  return props.project?.id;
});

const description = computed(() =>
  !projectExists.value
    ? t('projectManagerModal.newProject')
    : t('projectManagerModal.updateProject')
);

watch(
  () => props.open,
  () => {
    clearForm();

    form.name = props.project?.name || '';
    form.description = props.project?.description || '';
    form.responsible = props.project?.responsible || '';
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
