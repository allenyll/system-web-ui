import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/baseManager',
    component: Layout,
    name: '系统管理',
    meta: { title: '系统管理', icon: 'system' },
    icon: 'setting',
    // authority: 'baseManager',
    children: [{
      path: 'userManager',
      component: () => import('@/views/admin/user/index'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'user', noCache: true }
      // authority: 'userManager'
    }, {
      path: 'menuManager',
      component: () => import('@/views/admin/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'menu', noCache: true }
      // authority: 'menuManager'
    }]
  }
]