import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export interface IRouterNext {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
}
