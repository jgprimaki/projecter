import { route } from 'quasar/wrappers';

import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = await getCurrentUser();
    const isToAuthRoute = to.path.includes('auth');

    if (requiresAuth && !isAuthenticated) next('/auth');
    else if (isToAuthRoute && isAuthenticated) next('/');
    else next();
  });

  return Router;
});
