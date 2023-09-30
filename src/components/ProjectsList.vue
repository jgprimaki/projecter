<template>
  <q-table
    :columns="columns"
    :rows="projects"
    @row-click="openColumsPage"
    :filter="filter"
    title="Projetos"
    :no-data-label="$t('projectsList.table.noDataLabel')"
    :no-results-label="$t('projectsList.table.noResultsLabel')"
  >
    <template v-slot:top-right>
      <section :class="$style['header-actions']">
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          :placeholder="$t('projectsList.fields.search')"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          icon="add"
          color="primary"
          dense
          @click="changeModalVisibilty(true)"
        >
          {{ $t('projectsList.actions.newProject') }}
        </q-btn>
      </section>
    </template>

    <template v-slot:no-data="{ message }">
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon name="warning" size="sm"></q-icon>
        <span> {{ message }} </span>
      </div>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" :class="$style['actions']">
        <q-btn
          round
          color="primary"
          icon="edit"
          dense
          @click.stop="fillProjectData(props.row)"
          ><q-tooltip class="text-body2">
            {{ $t('projectsList.actions.updateProject') }}
          </q-tooltip>
        </q-btn>

        <q-btn round color="info" icon="open_in_new" dense
          ><q-tooltip class="text-body2">
            {{ $t('projectsList.actions.redirectToProject') }}
          </q-tooltip>
        </q-btn>

        <q-btn
          round
          color="negative"
          icon="delete"
          dense
          @click.stop="deleteProject(props.row)"
          ><q-tooltip class="text-body2">
            {{ $t('projectsList.actions.deleteProject') }}
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>

    <template #body-cell-column="props">
      <q-td :props="props">
        <span v-if="columnAmount(props.row)"
          >{{ columnAmount(props.row) }}
        </span>
      </q-td>
    </template>

    <template #body-cell-tasks="props">
      <q-td :props="props">
        <span v-if="taskAmount(props.row)">{{ taskAmount(props.row) }} </span>
      </q-td>
    </template>
  </q-table>

  <ProjectManagerModal
    :open="projectManagerModalVisibility"
    :project="project"
    @close="changeModalVisibilty(false)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import IProject from 'src/interfaces/Project';
import ProjectManagerModal from 'src/components/ProjectManagerModal.vue';
import { useProjectStore } from 'src/stores/projectStore';
import { useI18n } from 'vue-i18n';

const projectStore = useProjectStore();
const { t } = useI18n();

const router = useRouter();

defineProps<{
  projects: IProject[];
}>();

const columns: any = [
  {
    name: 'name',
    label: t('projectsList.table.columns.name'),
    field: 'name',
    align: 'left',
  },
  {
    name: 'description',
    label: t('projectsList.table.columns.description'),
    field: 'description',
    align: 'left',
  },
  {
    name: 'responsible',
    label: t('projectsList.table.columns.responsible'),
    field: 'responsible',
    align: 'left',
  },
  {
    name: 'column',
    label: t('projectsList.table.columns.column'),
    field: 'column',
    align: 'left',
  },
  {
    name: 'tasks',
    label: t('projectsList.table.columns.tasks'),
    field: 'tasks',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('projectsList.table.columns.actions'),
    field: 'actions',
    align: 'left',
  },
];

const projectManagerModalVisibility = ref(false);
const project = ref<IProject>({} as IProject);
const filter = ref('');

const fillProjectData = (row: IProject) => {
  project.value.id = row.id;
  project.value.name = row.name;
  project.value.description = row.description;
  project.value.responsible = row.responsible;
  changeModalVisibilty(true);
};

const changeModalVisibilty = (visible: boolean) => {
  projectManagerModalVisibility.value = visible;
};

const openColumsPage = (_: unknown, row: any) =>
  router.push(`/projects/${row.id}`);

const deleteProject = (row: IProject) => {
  projectStore.deleteProject(row.id ?? '');
};

const columnAmount = (row: IProject) => {
  return row.columns?.length;
};

const taskAmount = (row: IProject) => {
  return row.columns?.reduce((acc, curr) => acc + curr.tasks?.length, 0);
};
</script>

<style lang="scss" module>
.header-actions {
  @apply flex gap-3;
}
.actions {
  @apply flex gap-3;
}
</style>
