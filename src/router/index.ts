```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomePage from '../pages/HomePage.vue';
import CabinsPage from '../pages/CabinsPage.vue';
import CabinDetailPage from '../pages/CabinDetailPage.vue';
import ActivitiesPage from '../pages/ActivitiesPage.vue';
import MapPage from '../pages/MapPage.vue';
import ContactPage from '../pages/ContactPage.vue';
import GalleryPage from '../pages/GalleryPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';
import ProfilePage from '../pages/client/ProfilePage.vue';
import BookingsPage from '../pages/client/BookingsPage.vue';
import AdminDashboard from '../pages/admin/DashboardPage.vue';
import AdminCabins from '../pages/admin/CabinsPage.vue';
import AdminActivities from '../pages/admin/ActivitiesPage.vue';
import AdminBookings from '../pages/admin/BookingsPage.vue';
import AdminUsers from '../pages/admin/UsersPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/cabins', component: CabinsPage },
    { path: '/cabins/:id', component: CabinDetailPage },
    { path: '/activities', component: ActivitiesPage },
    { path: '/map', component: MapPage },
    { path: '/contact', component: ContactPage },
    { path: '/gallery', component: GalleryPage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    {
      path: '/profile',
      component: ProfilePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/bookings',
      component: BookingsPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', component: AdminDashboard },
        { path: 'cabins', component: AdminCabins },
        { path: 'activities', component: AdminActivities },
        { path: 'bookings', component: AdminBookings },
        { path: 'users', component: AdminUsers }
      ]
    }
  ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
```