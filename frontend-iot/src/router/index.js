import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/devices', name: 'Dispositivos', component: () => import('../views/Devices.vue') },
  { path: '/charts', name: 'Gráficas', component: () => import('../views/Charts.vue') },
  { path: '/history', name: 'Historial', component: () => import('../views/History.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router