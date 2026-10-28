import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import CreateFundraiserView from '../views/CreateFundraiserView.vue'
import HelpView from '../views/HelpView.vue'
import AuthView from '../views/AuthView.vue'
import AccountLayout from '../components/layout/AccountLayout.vue'
import ProfileView from '../views/account/ProfileView.vue'
import MyFundraisersView from '../views/account/MyFundraisersView.vue'
import AccountPlaceholderView from '../views/account/AccountPlaceholderView.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    {
      path: '/creer-une-cagnotte',
      name: 'create-fundraiser',
      component: CreateFundraiserView,
    },
    { path: '/centre-aide', name: 'help', component: HelpView },
    { path: '/connexion', name: 'login', component: AuthView },
    {
      path: '/compte',
      component: AccountLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'account-profile' } },
        {
          path: 'profil',
          name: 'account-profile',
          component: ProfileView,
          meta: { title: 'Mon profil' },
        },
        {
          path: 'cagnottes',
          name: 'account-fundraisers',
          component: MyFundraisersView,
          meta: { title: 'Mes cagnottes' },
        },
        {
          path: 'petitions',
          name: 'account-petitions',
          component: AccountPlaceholderView,
          meta: {
            title: 'Mes pétitions',
            description:
              'La gestion des pétitions sera disponible dans une prochaine version.',
          },
        },
        {
          path: 'sondages',
          name: 'account-surveys',
          component: AccountPlaceholderView,
          meta: {
            title: 'Mes sondages',
            description:
              'La gestion des sondages sera disponible dans une prochaine version.',
          },
        },
        {
          path: 'transactions',
          name: 'account-transactions',
          component: AccountPlaceholderView,
          meta: {
            title: 'Mes transactions',
            description:
              'Aucune transaction financière n’est encore disponible dans Fundelio.',
          },
        },
        {
          path: 'justificatifs',
          name: 'account-documents',
          component: AccountPlaceholderView,
          meta: {
            title: 'Mes justificatifs',
            description:
              'Le dépôt sécurisé de justificatifs sera disponible dans une prochaine version.',
          },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) return true

  const auth = useAuthStore()
  if (auth.isAuthenticated) return true
  return {
    name: 'login',
    query: { redirect: to.fullPath },
  }
})

export default router
