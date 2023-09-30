import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/projects',
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'projects', component: () => import('pages/ProjectsPage.vue') },
      {
        path: 'projects/:id',
        component: () => import('pages/SingleProjectPage.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    component: () => import('layouts/BlankLayout.vue'),

    children: [
      {
        path: '',
        redirect: '/auth/login',
        component: () => import('pages/AuthPage.vue'),
        children: [
          {
            path: 'login',
            component: () => import('src/components/LoginForm.vue'),
          },
          {
            path: 'register',
            component: () => import('src/components/RegisterForm.vue'),
          },
        ],
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
