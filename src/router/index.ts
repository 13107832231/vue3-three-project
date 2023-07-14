/*
 * @Author: 1231
 * @Date: 2023-06-29 16:32:54
 * @LastEditors: zhengjiefeng zhengjiefeng
 * @LastEditTime: 2023-07-05 09:10:09
 * @FilePath: \vue3-three-project\src\router\index.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/passwordInput',
      name: 'passwordInput',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/passwordInput.vue')
    },
    {
      path: '/house',
      name: 'house',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/house.vue')
    },
    {
      path: '/rain',
      name: 'rain',

      component: () => import('@/views/rain.vue')
    }
  ]
})

export default router
