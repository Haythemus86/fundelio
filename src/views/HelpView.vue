<script setup>
import { computed, ref } from 'vue'
import {
  BookOpen,
  CircleHelp,
  Heart,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from 'lucide-vue-next'
import AppNavbar from '../components/layout/AppNavbar.vue'

const search = ref('')

const categories = [
  {
    title: 'Dépense de ma cagnotte',
    description:
      'Utilisation des fonds : virement, achat ou paiement en ligne.',
    icon: WalletCards,
    color: 'green',
  },
  {
    title: 'Mon compte',
    description:
      'Espace personnel pour gérer les cagnottes et les informations.',
    icon: UserRound,
    color: 'blue',
  },
  {
    title: 'Ma participation',
    description: 'Suivi des contributions et des messages associés.',
    icon: Heart,
    color: 'red',
  },
  {
    title: 'Vie de ma cagnotte',
    description: 'Historique et activité globale de la cagnotte.',
    icon: BookOpen,
    color: 'purple',
  },
  {
    title: 'Sécurité & protection',
    description: 'Protection des données et transactions sécurisées.',
    icon: ShieldCheck,
    color: 'orange',
  },
  {
    title: 'Comment fonctionne ma cagnotte ?',
    description: 'Créer une cagnotte, la partager, collecter et dépenser.',
    icon: CircleHelp,
    color: 'cyan',
  },
]

const visibleCategories = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return categories

  return categories.filter((category) =>
    `${category.title} ${category.description}`.toLowerCase().includes(query),
  )
})
</script>

<template>
  <AppNavbar />
  <main class="help-page">
    <section class="help-hero" aria-labelledby="help-title">
      <h1 id="help-title">Centre d'aide</h1>
      <p>Utilisez la barre ci-dessous pour rechercher une information.</p>
      <label class="help-search">
        <Search :size="20" />
        <span class="sr-only">Rechercher dans le centre d'aide</span>
        <input
          v-model="search"
          type="search"
          aria-label="Rechercher dans le centre d'aide"
          placeholder="Rechercher..."
        />
      </label>
    </section>

    <section class="help-content" aria-labelledby="categories-title">
      <h2 id="categories-title" class="sr-only">Catégories d'aide</h2>
      <div v-if="visibleCategories.length" class="help-grid">
        <button
          v-for="category in visibleCategories"
          :key="category.title"
          class="help-card"
          type="button"
        >
          <span class="help-card-icon" :class="`icon-${category.color}`">
            <component :is="category.icon" :size="20" />
          </span>
          <span class="help-card-title">{{ category.title }}</span>
          <span class="help-card-description">{{ category.description }}</span>
        </button>
      </div>

      <div v-else class="help-empty">
        <Search :size="23" />
        <h2>Aucun résultat</h2>
        <p>Essayez avec d'autres mots-clés.</p>
      </div>

      <section class="support-card" aria-labelledby="support-title">
        <span class="support-icon"><CircleHelp :size="22" /></span>
        <h2 id="support-title">Vous n'avez pas trouvé votre réponse ?</h2>
        <p>Notre équipe support est disponible 7j/7</p>
        <div class="support-actions">
          <a class="support-email" href="mailto:support@fundelio.fr">
            <Mail :size="16" /> Email support
          </a>
          <a class="support-phone" href="tel:+33180000000">
            <Phone :size="16" /> Téléphone
          </a>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.help-page {
  min-height: calc(100vh - 64px);
  background: #fdfbf8;
}

.help-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 20px 55px;
  border-bottom: 1px solid #f0eae6;
  text-align: center;
}

.help-hero h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 2.15rem;
  line-height: 1.1;
}

.help-hero > p {
  margin-top: 12px;
  color: #746c6a;
  font-size: 0.96rem;
}

.help-search {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(578px, 100%);
  height: 50px;
  margin-top: 28px;
  padding: 0 16px;
  border: 1px solid #eaded8;
  border-radius: 14px;
  background: #fff;
  color: #77716f;
  box-shadow: 0 2px 4px rgba(64, 43, 33, 0.025);
}

.help-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 0.84rem;
}

.help-content {
  width: min(975px, 100%);
  margin: 0 auto;
  padding: 48px 20px 65px;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.help-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 150px;
  padding: 17px 16px;
  border: 1px solid #eee3de;
  border-radius: 14px;
  background: #fff;
  color: var(--color-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.help-card:hover {
  transform: translateY(-2px);
  border-color: #f1c9c0;
  box-shadow: 0 8px 20px rgba(64, 43, 33, 0.07);
}

.help-card:focus-visible {
  outline: 3px solid rgba(255, 102, 104, 0.25);
  outline-offset: 2px;
}

.help-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  border-radius: 11px;
}

.icon-green {
  color: #53a379;
  background: #edf9f2;
}
.icon-blue {
  color: #557cef;
  background: #eff3ff;
}
.icon-red {
  color: #e65967;
  background: #fff0f2;
}
.icon-purple {
  color: #795ee6;
  background: #f2efff;
}
.icon-orange {
  color: #d99324;
  background: #fff9eb;
}
.icon-cyan {
  color: #4095bb;
  background: #effaff;
}

.help-card-title {
  margin-top: 13px;
  font-size: 0.88rem;
  font-weight: 800;
}

.help-card-description {
  margin-top: 5px;
  color: #746c6a;
  font-size: 0.74rem;
  line-height: 1.45;
}

.help-empty {
  padding: 42px 20px;
  border: 1px dashed #eaded8;
  border-radius: 14px;
  background: #fff;
  color: #7b7370;
  text-align: center;
}

.help-empty h2 {
  margin: 10px 0 3px;
  color: var(--color-text);
  font-size: 1rem;
}

.help-empty p {
  font-size: 0.82rem;
}

.support-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding: 25px 20px 24px;
  border: 1px solid #f4dcd5;
  border-radius: 14px;
  background: #fff8f5;
  text-align: center;
}

.support-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  color: var(--color-primary);
}

.support-card h2 {
  margin: 13px 0 0;
  color: var(--color-text);
  font-size: 1rem;
}

.support-card > p {
  margin-top: 8px;
  color: #746c6a;
  font-size: 0.84rem;
}

.support-actions {
  display: flex;
  gap: 12px;
  margin-top: 17px;
}

.support-actions a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.support-email {
  background: var(--color-primary);
  color: #fff;
}

.support-phone {
  border: 1px solid #eaded8;
  background: #fff;
  color: var(--color-text);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media (max-width: 700px) {
  .help-hero {
    padding: 42px 14px 40px;
  }

  .help-hero h1 {
    font-size: 1.9rem;
  }

  .help-content {
    padding: 32px 14px 48px;
  }

  .help-grid {
    grid-template-columns: 1fr;
  }

  .help-card {
    min-height: 0;
  }
}

@media (max-width: 420px) {
  .support-actions {
    flex-direction: column;
    width: 100%;
    max-width: 220px;
  }

  .support-actions a {
    justify-content: center;
  }
}
</style>
