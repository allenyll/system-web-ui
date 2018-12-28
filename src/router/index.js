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
    redirect: 'dashboard',
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
    path: '/sys',
    component: Layout,
    name: '系统管理',
    meta: { title: '系统管理', icon: 'system', perms: 'sys:sys' },
    icon: 'setting',
    children: [{
      path: 'user',
      component: () => import('@/views/admin/user/index'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'user', perms: 'sys:user:user', noCache: true }
    }, {
      path: 'menu',
      component: () => import('@/views/admin/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'menu', perms: 'sys:menu:menu', noCache: true }
    }, {
      path: 'depot',
      component: () => import('@/views/admin/depot/index'),
      name: '组织管理',
      meta: { title: '组织管理', icon: 'tree', perms: 'sys:depot:depot', noCache: true }
    }, {
      path: 'role',
      component: () => import('@/views/admin/role/index'),
      name: '角色管理',
      meta: { title: '角色管理', icon: 'role', perms: 'sys:role:role', noCache: true }
    }]
  },
  {
    path: '/monitor',
    component: Layout,
    name: '系统工具',
    meta: { title: '系统工具', icon: 'system', perms: 'monitor:monitor' },
    icon: 'setting',
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/log/index'),
        name: '系统日志',
        meta: { title: '系统日志', icon: 'log', perms: 'sys:log:log', noCache: true }
      },
      {
        path: 'swagger',
        // redirect: 'https://localhost:8082/swagger-ui.html',
        component: () => import('@/views/monitor/swagger/index'),
        name: 'swagger',
        meta: { title: 'swagger', icon: 'log', perms: 'monitor:swagger:swagger', noCache: true }
      }
    ]
  }
]
