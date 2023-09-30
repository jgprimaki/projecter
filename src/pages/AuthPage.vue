<template>
  <q-page class="flex flex-center" padding>
    <q-card bordered :class="$style.auth">
      <q-card-section>
        <q-tabs inline-label no-caps>
          <q-route-tab
            to="/auth/login"
            :label="$t('auth.login.title')"
            icon="app:sign-in"
          />
          <q-route-tab
            to="/auth/register"
            :label="$t('auth.register.title')"
            icon="app:sign-up"
          />
        </q-tabs>
      </q-card-section>
      <q-card-section><router-view /></q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>

<style lang="scss" module>
.auth {
  @apply w-full max-w-[500px];
}
</style>
