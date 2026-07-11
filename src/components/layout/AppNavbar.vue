<script setup>
import { CircleHelp, LayoutGrid, Plus, Search, Wallet } from 'lucide-vue-next'
</script>

<template>
  <header class="app-navbar">
    <div class="navbar-container">
      <a class="brand" href="#" aria-label="Accueil Fundelio">
        <span class="brand-icon" aria-hidden="true">
          <Wallet :size="16" />
        </span>
        <span class="brand-text">Fundelio</span>
      </a>

      <nav class="navbar-links" aria-label="Navigation principale">
        <a class="nav-link nav-link-active" href="#">
          <Search :size="16" />
          <span>Découvrir</span>
        </a>
        <a class="nav-link" href="#">
          <LayoutGrid :size="16" />
          <span>Mes cagnottes</span>
        </a>
        <a class="nav-link" href="#">
          <CircleHelp :size="16" />
          <span>Centre d'aide</span>
        </a>
      </nav>

      <a class="create-button" href="#" aria-label="Créer une cagnotte">
        <Plus :size="16" />
        <span class="create-label">Créer une cagnotte</span>
      </a>
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

.nav-link-active {
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
}
</style>
