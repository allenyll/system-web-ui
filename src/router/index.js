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
    meta: { title: '系统管理', icon: 'sw-system', perms: 'sys:sys' },
    icon: 'setting',
    children: [{
      path: 'user',
      component: () => import('@/views/admin/user/index'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'sw-user', perms: 'sys:user:user', noCache: true }
    }, {
      path: 'menu',
      component: () => import('@/views/admin/menu/index'),
      name: '菜单管理',
      meta: { title: '菜单管理', icon: 'sw-menu', perms: 'sys:menu:menu', noCache: true }
    }, {
      path: 'depot',
      component: () => import('@/views/admin/depot/index'),
      name: '组织管理',
      meta: { title: '组织管理', icon: 'sw-depot', perms: 'sys:depot:depot', noCache: true }
    }, {
      path: 'role',
      component: () => import('@/views/admin/role/index'),
      name: '角色管理',
      meta: { title: '角色管理', icon: 'sw-role', perms: 'sys:role:role', noCache: true }
    }]
  },
  {
    path: '/sys/dict',
    // component: () => import('@/views/admin/dict/index'),
    component: Layout,
    name: '字典管理',
    meta: { title: '字典管理', icon: 'sw-dict', perms: 'sys:dict:dict', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/views/admin/dict/index'),
        name: '字典列表',
        meta: { title: '字典列表', icon: 'sw-dict', perms: 'sys:dict:list', noCache: true }
      },
      {
        path: 'edit',
        component: () => import('@/views/admin/dict/components/childDict'),
        name: '编辑字典',
        meta: { title: '编辑字典', noCache: true, perms: 'sys:dict:edit' },
        hidden: true
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: '系统工具',
    meta: { title: '系统工具', icon: 'sw-tools', perms: 'monitor:monitor' },
    icon: 'setting',
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/log/index'),
        name: '系统日志',
        meta: { title: '系统日志', icon: 'sw-log', perms: 'sys:log:log', noCache: true }
      },
      {
        path: 'swagger',
        // redirect: 'https://localhost:8082/swagger-ui.html',
        component: () => import('@/views/monitor/swagger/index'),
        name: '接口文档',
        meta: { title: '接口文档', icon: 'sw-interface', perms: 'monitor:swagger:swagger', noCache: true }
      },
      {
        path: 'generator',
        component: () => import('@/views/monitor/generator/index'),
        name: '代码工具',
        meta: { title: '代码工具', icon: 'sw-code', perms: 'sys:generator:generator', noCache: true }
      },
      {
        path: 'cache',
        component: () => import('@/views/monitor/cache/index'),
        name: '缓存管理',
        meta: { title: '缓存管理', icon: 'sw-cache', perms: 'sys:cache:cache', noCache: true }
      },
      {
        path: 'job',
        component: () => import('@/views/admin/job/index'),
        name: '调度任务',
        meta: { title: '调度任务', icon: 'sw-job', perms: 'sys:job:list', noCache: true }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: '会员管理',
    meta: { title: '会员管理', icon: 'sw-customer', perms: 'customer:customer' },
    icon: 'setting',
    children: [
      {
        path: 'customer',
        component: () => import('@/views/customer/customer/index'),
        name: '会员管理',
        meta: { title: '会员管理', icon: 'sw-role', perms: 'customer:customer:list', noCache: true }
      },
      {
        path: 'customerPoint',
        component: () => import('@/views/customer/customerPoint/index'),
        name: '积分管理',
        meta: { title: '积分管理', icon: 'sw-point', perms: 'customer:point:list', noCache: true }
      },
      {
        path: 'customerPointDetail',
        component: () => import('@/views/customer/customerPointDetail/index'),
        name: '积分详情',
        meta: { title: '积分详情', noCache: true, perms: 'customer:customerPointDetail:list' },
        hidden: true
      },
      {
        path: 'balance',
        component: () => import('@/views/customer/balance/index'),
        name: '余额管理',
        meta: { title: '余额管理', icon: 'sw-balance', perms: 'customer:balance:list', noCache: true }
      }
    ]
  }
]
