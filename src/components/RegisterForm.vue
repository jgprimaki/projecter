<template>
  <q-form greedy class="flex flex-col gap-2" @submit="login">
    <q-input
      v-model="email"
      :label="$t('auth.register.fields.email')"
      outlined
      rounded
      dense
      :rules="[
        (val, rules) =>
          rules.email(val) || $t('auth.register.rules.invalidEmail'),
      ]"
    />
    <q-input
      v-model="password"
      :label="$t('auth.register.fields.password')"
      outlined
      rounded
      dense
      :rules="[
        (val) =>
          val.length >= passwordMinimumSize ||
          $t('auth.register.rules.passwordMinimumSize', [passwordMinimumSize]),
      ]"
      type="password"
    />

    <q-btn
      :label="$t('auth.register.actions.login')"
      :loading="loading"
      type="submit"
      dense
      rounded
      glossy
      color="primary"
      class="w-full mt-4"
    />

    <section class="mt-8 flex flex-col items-center gap-5">
      <span>{{ $t('auth.register.descriptions.signIn') }}</span>
      <q-btn icon="app:google" round flat size="lg" @click="openGooglePopup" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = getAuth();
const router = useRouter();
const provider = new GoogleAuthProvider();
const $q = useQuasar();
const { t } = useI18n();
const passwordMinimumSize = 6;

const login = async () => {
  loading.value = true;
  await createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((user) => user && router.push({ path: '/' }))
    .finally(() => (loading.value = false))
    .catch((error) => {
      let message;

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = t('auth.register.messages.emailAlreadyInUse');
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
