import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home'
    }
  ]
})

// Export router instance for use in stores
export { router }
export default router

