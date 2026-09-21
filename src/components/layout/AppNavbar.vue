<script setup>
import { CircleHelp, LayoutGrid, Plus, Search, Wallet } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()
</script>

<template>
  <header class="app-navbar">
    <div class="navbar-container">
      <RouterLink class="brand" to="/" aria-label="Accueil Fundelio">
        <span class="brand-icon" aria-hidden="true">
          <Wallet :size="16" />
        </span>
        <span class="brand-text">Fundelio</span>
      </RouterLink>

      <nav class="navbar-links" aria-label="Navigation principale">
        <RouterLink class="nav-link" to="/">
          <Search :size="16" />
          <span>Découvrir</span>
        </RouterLink>
        <RouterLink class="nav-link" to="/projects">
          <LayoutGrid :size="16" />
          <span>Mes cagnottes</span>
        </RouterLink>
        <RouterLink class="nav-link" to="/centre-aide">
          <CircleHelp :size="16" />
          <span>Centre d'aide</span>
        </RouterLink>
      </nav>

      <div v-if="!auth.isAuthenticated" class="auth-actions">
        <RouterLink class="sign-in-link" to="/connexion?mode=login">
          Se connecter
        </RouterLink>
        <RouterLink class="sign-up-button" to="/connexion?mode=signup">
          S’inscrire
        </RouterLink>
      </div>
      <div v-else class="user-actions">
        <span class="user-greeting">Bonjour {{ auth.user.firstName }}</span>
        <button class="logout-button" type="button" @click="auth.logout()">
          Déconnexion
        </button>
      </div>

      <RouterLink
        class="create-button"
        to="/creer-une-cagnotte"
        aria-label="Créer une cagnotte"
      >
        <Plus :size="16" />
        <span class="create-label">Créer une cagnotte</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid var(--color-border);
}

.navbar-container {
  max-width: var(--container-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  text-decoration: none;
  flex-shrink: 0;
}

.brand-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-size: 1.05rem;
  font-weight: 700;
}

.navbar-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 9px 12px;
  border-radius: 12px;
}

.nav-link.router-link-exact-active {
  background: var(--color-background-soft);
  color: var(--color-text);
}

.create-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
  border-radius: 12px;
  padding: 10px 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.create-button:hover {
  background: var(--color-primary-dark);
}

.auth-actions,
.user-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.sign-in-link,
.logout-button {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
}

.sign-up-button {
  padding: 10px 13px;
  border-radius: 10px;
  background: #fff0eb;
  color: var(--color-primary-dark);
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
}

.logout-button {
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.user-greeting {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 14px;
  }

  .navbar-links {
    display: none;
  }

  .create-button {
    width: 40px;
    height: 40px;
    justify-content: center;
    padding: 0;
    border-radius: 10px;
  }

  .create-label {
    display: none;
  }

  .auth-actions,
  .user-actions {
    gap: 7px;
  }

  .sign-in-link,
  .user-greeting {
    display: none;
  }

  .sign-up-button {
    padding: 9px 10px;
    font-size: 0.78rem;
  }
}
</style>
