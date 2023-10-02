<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar class="bg-primary text-white">
      <q-icon name="dashboard" size="xl"></q-icon>

      <q-toolbar-title>Projecter</q-toolbar-title>

      <q-btn flat round dense icon="logout" @click="logout">
        <q-tooltip class="text-body2">
          {{ $t('general.disconnect') }}: {{ userStore.currentUser }}</q-tooltip
        ></q-btn
      >
    </q-toolbar>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';

const router = useRouter();
const auth = getAuth();
const userStore = useUserStore();

const logout = async () => {
  await signOut(auth).then(() => router.push({ path: '/auth/login' }));
};
</script>
