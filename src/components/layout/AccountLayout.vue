<script setup>
import {
  ArrowLeft,
  ChartNoAxesColumn,
  FileText,
  HandCoins,
  Landmark,
  LogOut,
  UserRound,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import AppNavbar from './AppNavbar.vue'

const auth = useAuthStore()
const router = useRouter()

const sections = [
  { name: 'account-profile', label: 'Mon profil', icon: UserRound },
  { name: 'account-fundraisers', label: 'Mes cagnottes', icon: HandCoins },
  { name: 'account-petitions', label: 'Mes pétitions', icon: FileText },
  { name: 'account-surveys', label: 'Mes sondages', icon: ChartNoAxesColumn },
  { name: 'account-transactions', label: 'Mes transactions', icon: Landmark },
  { name: 'account-documents', label: 'Mes justificatifs', icon: FileText },
]

const logout = async () => {
  auth.logout()
  await router.push('/')
}
</script>

<template>
  <AppNavbar />
  <main class="account-page">
    <div class="account-shell">
      <header class="account-heading">
        <p class="eyebrow">VOTRE ESPACE FUNDELIO</p>
        <h1>Mon compte</h1>
      </header>

      <div class="account-columns">
        <aside class="account-sidebar" aria-label="Navigation du compte">
          <nav class="account-navigation">
            <RouterLink
              v-for="section in sections"
              :key="section.name"
              :to="{ name: section.name }"
              class="account-navigation-link"
              active-class="active"
            >
              <component :is="section.icon" :size="18" aria-hidden="true" />
              <span>{{ section.label }}</span>
            </RouterLink>
          </nav>
          <RouterLink class="account-back-link" to="/">
            <ArrowLeft :size="16" /> Retour à Fundelio
          </RouterLink>
          <button class="account-logout" type="button" @click="logout">
            <LogOut :size="16" /> Se déconnecter
          </button>
        </aside>

        <section class="account-content">
          <RouterView />
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.account-page {
  min-height: calc(100vh - 64px);
  padding: 38px 20px 72px;
  background: var(--color-background-soft);
}

.account-shell {
  width: min(var(--container-width), 100%);
  margin: 0 auto;
}

.account-heading {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 7px;
  color: var(--color-primary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.account-heading h1 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
}

.account-columns {
  display: grid;
  grid-template-columns: 238px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
}

.account-sidebar,
.account-content {
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-background);
  box-shadow: 0 12px 30px rgb(61 37 26 / 5%);
}

.account-sidebar {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 14px;
}

.account-navigation {
  display: grid;
  gap: 5px;
}

.account-navigation-link,
.account-back-link,
.account-logout {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 9px 11px;
  border: 0;
  border-radius: 11px;
  color: var(--color-text-muted);
  background: transparent;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 650;
  text-align: left;
  text-decoration: none;
  transition:
    color 150ms ease,
    background-color 150ms ease;
}

.account-navigation-link:hover,
.account-back-link:hover,
.account-logout:hover {
  color: var(--color-primary-dark);
  background: var(--color-background-soft);
}

.account-navigation-link.active {
  color: var(--color-primary-dark);
  background: #fff0eb;
}

.account-back-link,
.account-logout {
  border-top: 1px solid var(--color-border);
  border-radius: 0;
  padding-top: 15px;
}

.account-logout {
  cursor: pointer;
}

.account-content {
  min-width: 0;
  min-height: 540px;
  padding: clamp(20px, 3vw, 34px);
}

@media (max-width: 800px) {
  .account-page {
    padding: 26px 14px 48px;
  }

  .account-columns {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .account-sidebar {
    position: static;
    padding: 9px;
  }

  .account-navigation {
    display: flex;
    overflow-x: auto;
    gap: 4px;
    padding-bottom: 2px;
  }

  .account-navigation-link {
    flex: 0 0 auto;
    min-height: 38px;
    padding: 8px 10px;
    font-size: 0.82rem;
  }

  .account-navigation-link svg {
    display: none;
  }

  .account-back-link,
  .account-logout {
    min-height: 36px;
    padding: 10px 8px 0;
    font-size: 0.82rem;
  }

  .account-content {
    min-height: 400px;
    padding: 20px 16px;
  }
}
</style>
