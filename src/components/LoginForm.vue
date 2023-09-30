<template>
  <q-form greedy class="flex flex-col gap-2" @submit="login">
    <q-input
      v-model="email"
      :label="$t('auth.login.fields.email')"
      outlined
      rounded
      dense
      :rules="[
        (val, rules) => rules.email(val) || $t('auth.login.rules.invalidEmail'),
      ]"
      autofocus
    />
    <q-input
      v-model="password"
      :label="$t('auth.login.fields.password')"
      outlined
      rounded
      dense
      :rules="[
        (val) =>
          val.length >= passwordMinimumSize ||
          $t('auth.login.rules.passwordMinimumSize', [passwordMinimumSize]),
      ]"
      type="password"
    />

    <q-btn
      :label="$t('auth.login.actions.login')"
      :loading="loading"
      type="submit"
      dense
      rounded
      glossy
      color="primary"
      class="w-full mt-4"
    />

    <section class="mt-8 flex flex-col items-center gap-5">
      <span>{{ $t('auth.login.descriptions.signIn') }}</span>
      <q-btn icon="app:google" round flat size="lg" @click="openGooglePopup" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();
const passwordMinimumSize = 5;

const login = async () => {
  loading.value = true;
  await signInWithEmailAndPassword(auth, email.value, password.value)
    .then((user) => user && router.push({ path: '/' }))
    .finally(() => (loading.value = false))
    .catch((error) => {
      let message;

      switch (error.code) {
        case 'auth/user-not-found':
          message = t('auth.login.messages.userNotFound');
          break;

        case 'auth/wrong-password':
          message = t('auth.login.messages.wrongPassword');
          break;

        default:
          message = error.code;
          break;
      }

      $q.notify({
        type: 'negative',
        message,
        position: 'top',
      });
    });
};

const openGooglePopup = async () => {
  signInWithPopup(auth, provider).then(() => router.push({ path: '/' }));
};
</script>
