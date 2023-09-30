<template>
  <q-page padding>
    <ProjectsList :projects="projectStore.projects" />
  </q-page>
</template>

<script setup lang="ts">
import ProjectsList from 'src/components/ProjectsList.vue';
import { useProjectStore } from 'src/stores/projectStore';

const projectStore = useProjectStore();
</script>

<style lang="scss" module></style>
