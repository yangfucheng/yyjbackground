import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
 

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    },
     { 
      path: 'online/detail',
      name: 'detail', 
      component: () => import('@/views/online/detail')
    },
    ]
  },
  {
    path: '/index',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '首页', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/index/index'),
        meta: { title: '主页', icon: 'table' }
      }
    ]
  },
  {
    path: '/management',
    component: Layout,
    meta: { title: '平台资产管理', icon: 'tree' },
    children: [
      // {
      //   path: 'index',
      //   name: 'Form',
      //   component: () => import('@/views/form/index'),
      //   meta: { title: '投票项目管理', icon: 'table' }
      // },
      {
        path: 'airdrop',
        name: 'airdrop',
        component: () => import('@/views/management/airdrop'),
        meta: { title: '空投', icon: 'table' }
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: () => import('@/views/management/withdraw'),
        meta: { title: '提现流水', icon: 'table' }
      },
    ]
  },
  {
    path: '/online',
    component: Layout,
    meta: { title: '上线项目管理', icon: 'tree' },
    children: [
      { 
      path: 'managelist',
      name: 'managelist', 
      component: () => import('@/views/online/manageList'),
      meta: { title: '项目列表', icon: 'table' }
      },
      { 
        path: 'launch',
        name: 'launch', 
        component: () => import('@/views/online/launch'),
        meta: { title: '项目发起', icon: 'table' }
      },
      { 
        path: 'online',
        name: 'online', 
        component: () => import('@/views/online/online'),
        meta: { title: '待上线项目', icon: 'table' }
      },
      { 
        path: 'result',
        name: 'result', 
        component: () => import('@/views/online/result'),
        meta: { title: '结束项目', icon: 'table' }
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

