<template>
  <q-page :class="$style.page" padding>
    <BoardColumnList />
  </q-page>
</template>

<script setup>
import BoardColumnList from 'src/components/BoardColumnList.vue';
</script>

<style lang="scss" module>
.page {
  @apply flex justify-center;
}
</style>
