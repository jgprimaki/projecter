<template>
  <section :class="$style.page">
    <BoardColumnList />
  </section>
</template>

<script setup>
import BoardColumnList from 'src/components/BoardColumnList.vue';
</script>

<style lang="scss" module>
.page {
  @apply p-4;
}
</style>
