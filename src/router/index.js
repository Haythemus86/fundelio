import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import CreateFundraiserView from '../views/CreateFundraiserView.vue'
import HelpView from '../views/HelpView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/projects', component: ProjectsView },
    { path: '/creer-une-cagnotte', component: CreateFundraiserView },
    { path: '/centre-aide', component: HelpView },
  ],
})

export default router
