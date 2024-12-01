import { createRouter, createWebHistory } from 'vue-router'
import { getUser, isAdmin, isPatient, isDoctor } from '@/utils';

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import("views/Home.vue"),
    redirect: '/index', // 重定向到 /index
    children: [ // 子路由配置
      {
        path: '/index',
        name: 'Index',
        component: () => import("views/home/Hello.vue")
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import("views/Dashboard.vue")
      },
      {
        path: '/about',
        name: 'About',
        component: () => import("views/others/About.vue")
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import("views/user/User.vue")
      },
      {
        path: '/users/:id',
        name: 'UserDetail',
        component: () => import("views/user/UserDetail.vue")
      },
      {
        path: '/user_groups',
        name: 'UserGroups',
        component: () => import("views/user/UserGroup.vue")
      },
      {
        path: '/groups',
        name: 'Groups',
        component: () => import("views/user/SysGroup.vue")
      },
      {
        path: '/groups/:id',
        name: 'GroupDetail',
        component: () => import("views/user/GroupDetail.vue")
      },
      {
        path: '/rbac',
        name: 'RBAC',
        component: () => import("views/auth/RBAC.vue")
      },
      {
        path: '/apps',
        name: 'Applications',
        component: () => import("views/container/Application.vue")
      },
      {
        path: '/apps/:id/exec',
        name: 'ContainerTerminal',
        component: () => import("views/container/ContainerTerminal.vue")
      },
      {
        path: '/apps/:id/proxy:proxyPath(.*)',
        name: 'Proxy',
        component: () => import("views/container/Proxy.vue"),
      },
      {
        path: '/404',
        name: '404',
        component: () => import('views/others/404.vue')
      },
      {
        path: '/patient/medical-records_patient',
        name: 'MedicalRecords_patient',
        component: () => import("views/patient/MedicalRecords_patient.vue")
      },
      {
        path: '/doctor/medical-records_doctor',
        name: 'MedicalRecords_doctor',
        component: () => import("views/doctor/MedicalRecords_doctor.vue")
      },
      {
        path: '/doctor/patient-managements_doctor',
        name: 'PatientManagements_doctor',
        component: () => import("views/doctor/PatientManagements_doctor.vue")
      },
      {
        path: '/admin/doctor-managements',
        name: 'DoctorManagements',
        component: () => import("views/admin/DoctorManagements.vue")
      },
      {
        path: '/:pathMatch(.*)',
        redirect: '/404' // 捕获所有未定义的路由，重定向到404页面
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("views/auth/Login.vue")
  },
  {
    path: '/oauth',
    name: 'OAuth',
    component: () => import("views/auth/OAuth.vue")
  },
  {
    path: '/docs',
    name: 'Document',
    component: () => import("views/doc/List.vue"),
    redirect: '/docs/introduce',
    children: [ // 文档子路由配置
      {
        path: ':page',
        name: 'DocDetail',
        component: () => import('views/doc/Detail.vue')
      }
    ]
  },
  {
    path: '/posts',
    name: 'Post',
    component: () => import('views/post/Home.vue'),
    redirect: '/posts/list',
    children: [ // 帖子子路由配置
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('views/post/Editor.vue')
      },
      {
        path: 'editor/:id',
        name: 'Draft',
        component: () => import('views/post/Editor.vue')
      },
      {
        path: 'list',
        name: 'PostList',
        component: () => import('views/post/List.vue')
      },
      {
        path: ':post',
        name: 'PostDetail',
        component: () => import('views/post/Detail.vue')
      }
    ]
  },
]

// 创建路由实例并配置路由历史记录模式
const router = createRouter({
  history: createWebHistory(import.meta.env.WEAVE_BASE),
  routes
})

// 配置路由守卫
router.beforeEach((to, from, next) => {
  let isAuthenticated = false;
  let user = getUser(); // 获取当前用户
  if (user && user.name) {
    isAuthenticated = true; // 判断用户是否已登录
  }

  // 未登录的用户不能访问除登录和OAuth外的页面
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'OAuth') next({ name: 'Login' })
  // 已登录的用户访问登录和OAuth页面时重定向到主页
  else if (isAuthenticated && (to.name == 'Login' || to.name == 'OAuth')) next({ name: 'Index' })
  else next() // 其他情况放行
})

export default router
