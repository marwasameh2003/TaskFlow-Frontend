import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/LoginPage.vue"),
    meta: { requiresGuest: true },
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("@/pages/loginPage.vue"),
  //   meta: { requiresGuest: true },
  // },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/RegisterPage.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/pages/DashboardPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/projects/:id",
    name: "ProjectDetail",
    component: () => import("@/pages/ProjectDetailPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/tasks/:id",
    name: "TaskDetail",
    component: () => import("@/pages/TaskDetailPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/pages/ProfilePage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return "/dashboard";
  }
});
export default router;
