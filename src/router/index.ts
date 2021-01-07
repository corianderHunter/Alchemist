import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'


Vue.use(VueRouter)

export const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/MainContainer/index.vue'),
    children: []
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue')
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
