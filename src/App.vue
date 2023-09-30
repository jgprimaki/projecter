<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { parseIcons } from './helpers/iconParser';

const $q = useQuasar();
$q.dark.set(true);

onMounted(() => {
  parseIcons();
});
</script>
